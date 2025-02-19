export default interface MarkdownFile {
  name: string;
  path: string;
  url: string;
  type: 'file' | 'dir';
  children?: MarkdownFile[];
}
