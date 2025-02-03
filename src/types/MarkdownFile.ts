export default interface MarkdownFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  children?: MarkdownFile[];
}
