/**
 * transform markdown image links to image api links
 * @param markdown markdown contents
 * @param baseUrl  base url to image api : which we will get image from.
 * @returns return makrdown content with image links transformed to image api.
 */
export function transformImageLinks(markdown: string, baseUrl: string): string {
  return markdown.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (match, p1) => {
    const newUrl = `${baseUrl}/${p1}`;
    return match.replace(p1, newUrl);
  });
}

/**
 * Transform latex math expression to block math expression.
 * remark-math plugin's block math expression require \n: linebreak between $$.
 * so we add \n between $$ to make block math expression, due to obsidian's latex math expression.
 * @param markdown markdown contents
 * @returns return markdown content that supports block math expression of remark-math.
 */
export function blockMathConverter(markdown: string): string {
  let result = '';
  let isMathBlock = false;
  let buffer = '';
  let isQuoteBlock = false;

  const lines = markdown.split('\n');
  const quoteMathRegExp = new RegExp(/^>\s*\$/);

  for (const line of lines) {
    let current = line;

    while (current.includes('$$')) {
      // find the line which contains '$$'
      const index = current.indexOf('$$');

      if (isMathBlock) {
        // find end of math block ($$) → end of block
        buffer += current.slice(0, index); // add content to buffer
        const content = buffer.trim();

        // check if there is content after math block : if there is, add '>' to the front of the content to make it a quote block.
        const afterContent = current.slice(index + 2).trim();

        if (isQuoteBlock) {
          // if mathblock is in quote block, add '>' to the front of the content.
          result += `\n> $$\n> ${content.replace(/\n/g, '\n> ')}\n> $$`;

          if (afterContent) {
            result += `\n> `; // add '>' to the front of the content.
          }
        } else {
          // 일반 블록 수식 처리
          result += `\n$$\n${content}\n$$\n`;
        }

        buffer = '';
        isMathBlock = false;
        isQuoteBlock = false;
      } else {
        // check current line is quote block : if it is, > and $$ exists in the front of the line, with some spaces(or not).
        if (quoteMathRegExp.test(current.trimStart())) {
          isQuoteBlock = true;
        }

        result += current.slice(0, index);
        isMathBlock = true;
      }

      current = current.slice(index + 2);
    }

    // 수식 블록 내부일 때는 buffer에 누적
    if (isMathBlock) {
      buffer += current + '\n';
    } else {
      result += current + '\n';
    }
  }

  return result.trim();
}

export function removeExt(name: string) {
  return name.replace(/\.[^/.]+$/, '');
}
