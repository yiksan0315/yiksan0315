export default interface PageProps {
  params: Promise<{ slug: string[] }>;
}
