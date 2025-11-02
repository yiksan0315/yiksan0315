export default interface MarkdownFile {
  name: string;
  path: string; // relateive format to root, without leading '/'
  url: string; // '/Study/...' format
  type: 'file' | 'dir';
  children?: MarkdownFile[];
}
