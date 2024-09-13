import katex from 'katex';
import 'katex/dist/katex.min.css';
import { marked, Tokens } from 'marked';

const renderer = new marked.Renderer();
const tokenizer = new marked.Tokenizer();

tokenizer.inlineText = (src: string) => {
  const inlineLatexRegex = /^\$(.+?)\$/;
  const match = inlineLatexRegex.exec(src);
  if (match) {
    const formula = match[1];
    const html = katex.renderToString(formula, {
      throwOnError: false,
    });
    return {
      type: 'text',
      raw: match[0],
      text: html,
      tokens: [], // 빈 배열로 반환하여 나머지 토큰이 발생하지 않도록 함
    };
  }
  return undefined;
};

tokenizer.paragraph = (src: string) => {
  const blockLatexRegex = /^\$\$([\s\S]+?)\$\$/;
  const match = blockLatexRegex.exec(src);
  if (match) {
    const formula = match[1];
    const html = katex.renderToString(formula, {
      throwOnError: false,
      displayMode: true,
    });
    return {
      type: 'paragraph',
      raw: match[0],
      text: html,
      tokens: [], // 빈 배열로 반환하여 나머지 토큰이 발생하지 않도록 함
    };
  }
  return undefined;
};

renderer.paragraph = ({ text }: Tokens.Paragraph) => {
  const latexRegex = /\$\$([\s\S]+?)\$\$/g;
  text = text.replace(latexRegex, (_, formula) => {
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (error) {
      return formula;
    }
  });
  return `<p>${text}</p>`;
};

export default async function parseMarkdown(content: string): Promise<string> {
  marked.use({ renderer });
  const result = marked(content);
  return result.toString();
}
