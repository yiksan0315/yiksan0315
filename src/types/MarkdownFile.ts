export default interface MarkdownFile {
  name: string;
  path: string;
  type: 'image' | 'mdFile' | 'dir';
  children?: MarkdownFile[];
}
