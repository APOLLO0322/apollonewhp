import HomeExperience from "@/components/home-experience";
import { getWorks } from "@/lib/works";

export default async function HomePage() {
  const works = await getWorks();
  return <HomeExperience works={works} />;
}
