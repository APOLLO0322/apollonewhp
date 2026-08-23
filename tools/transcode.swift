import AVFoundation
import Foundation

// web配信用トランスコーダ。H.264 / 音声なし / ビットレート指定 / faststart。
// usage: swift transcode.swift <in> <out> <bitrateKbps> [maxHeight]

let args = CommandLine.arguments
guard args.count >= 4 else {
    FileHandle.standardError.write("usage: transcode.swift <in> <out> <kbps> [maxHeight]\n".data(using: .utf8)!)
    exit(2)
}
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
let kbps = Int(args[3]) ?? 3500
let maxHeight = args.count > 4 ? Int(args[4]) ?? 1080 : 1080

try? FileManager.default.removeItem(at: outURL)

let asset = AVURLAsset(url: inURL)
let videoTracks = try await asset.loadTracks(withMediaType: .video)
guard let track = videoTracks.first else {
    FileHandle.standardError.write("no video track\n".data(using: .utf8)!)
    exit(1)
}

let naturalSize = try await track.load(.naturalSize)
let transform = try await track.load(.preferredTransform)
let nominalFPS = try await track.load(.nominalFrameRate)

// 回転を考慮した表示サイズ
let displaySize = naturalSize.applying(transform)
var width = abs(displaySize.width)
var height = abs(displaySize.height)

if Int(height) > maxHeight {
    let scale = CGFloat(maxHeight) / height
    width = (width * scale).rounded()
    height = CGFloat(maxHeight)
}
// H.264 は偶数寸法が必要
width = (width / 2).rounded() * 2
height = (height / 2).rounded() * 2

let reader = try AVAssetReader(asset: asset)
let readerOutput = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [
        kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange,
    ]
)
readerOutput.alwaysCopiesSampleData = false
reader.add(readerOutput)

let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
writer.shouldOptimizeForNetworkUse = true   // faststart（先頭にmoovを置く）

let fps = nominalFPS > 0 ? Int(nominalFPS.rounded()) : 30
let writerInput = AVAssetWriterInput(
    mediaType: .video,
    outputSettings: [
        AVVideoCodecKey: AVVideoCodecType.h264,
        AVVideoWidthKey: Int(width),
        AVVideoHeightKey: Int(height),
        AVVideoCompressionPropertiesKey: [
            AVVideoAverageBitRateKey: kbps * 1000,
            AVVideoMaxKeyFrameIntervalKey: fps * 2,
            AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
            AVVideoAllowFrameReorderingKey: true,
        ],
    ]
)
writerInput.expectsMediaDataInRealTime = false
// 音声トラックは足さない = 無音（自動再生の条件を満たす）
writer.add(writerInput)

guard reader.startReading() else { throw reader.error ?? NSError(domain: "reader", code: 1) }
guard writer.startWriting() else { throw writer.error ?? NSError(domain: "writer", code: 1) }
writer.startSession(atSourceTime: .zero)

let queue = DispatchQueue(label: "transcode")
let done = DispatchSemaphore(value: 0)

writerInput.requestMediaDataWhenReady(on: queue) {
    while writerInput.isReadyForMoreMediaData {
        guard let buffer = readerOutput.copyNextSampleBuffer() else {
            writerInput.markAsFinished()
            writer.finishWriting { done.signal() }
            return
        }
        writerInput.append(buffer)
    }
}

done.wait()

if writer.status == .completed {
    let bytes = (try? FileManager.default.attributesOfItem(atPath: outURL.path)[.size] as? Int) ?? 0
    let mb = Double(bytes ?? 0) / 1_048_576
    print(String(format: "OK  %@  %dx%d  %.2f MB", outURL.lastPathComponent, Int(width), Int(height), mb))
} else {
    FileHandle.standardError.write("failed: \(String(describing: writer.error))\n".data(using: .utf8)!)
    exit(1)
}
