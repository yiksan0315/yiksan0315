export default interface MarkdownFile {
  path: string;
  name: string;
  type: 'file' | 'dir';
  url: string;
  /**
   * Only for directories
   */
  subFolder?: MarkdownFile[];
}
