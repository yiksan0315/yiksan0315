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

  const lines = markdown.split('\n');

  for (const line of lines) {
    let current = line;

    while (current.includes('$$')) {
      const index = current.indexOf('$$');

      if (isMathBlock) {
        // 종료 기호 ($$) 발견 → 블록 종료
        buffer += current.slice(0, index);
        result += `\n$$\n${buffer.trim()}\n$$\n`;
        buffer = '';
        isMathBlock = false;
      } else {
        // 시작 기호 ($$) 발견 → 블록 시작
        result += current.slice(0, index);
        isMathBlock = true;
      }

      // 다음 문자열로 이동
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

// 그니까는 문제가 ==> \n을 >이 있을 때 삽입 ==> \n 다음 줄 앞에는 > 가 없음 ==> 그냥 일반 블록 처리.
// > 이 들어가도 수학식 처리가 되니까, 만약 > 이 앞에 있는 경우에는 그에 맞게 처리가 되어야 함. 그래서 이 부분을 처리해주는 것이 필요함.

/**
 * $$로 감싸진 수식을 처리하고, 인용구 내에서는 '>'를 유지하며,
 * 수식 뒤에 본문이 붙은 경우 본문 앞에도 '>'를 추가하는 함수
 */
export function convertMath(markdown: string): string {
  let result = '';
  let isMathBlock = false;
  let buffer = '';
  let isQuoteBlock = false;

  const lines = markdown.split('\n');

  for (const line of lines) {
    let current = line;

    while (current.includes('$$')) {
      const index = current.indexOf('$$');

      if (isMathBlock) {
        // 종료 기호 ($$) 발견 → 블록 종료
        buffer += current.slice(0, index);
        const content = buffer.trim();

        // 종료 후 바로 본문이 붙어있으면 처리
        const afterContent = current.slice(index + 2).trim();
        const prefix = isQuoteBlock ? '> ' : '';

        if (isQuoteBlock) {
          // 인용구 내 수식 처리
          result += `\n> $$\n> ${content.replace(/\n/g, '\n> ')}\n> $$\n`;

          if (afterContent) {
            result += `> ${afterContent}\n`; // 본문 앞에 '>' 추가
          }
        } else {
          // 일반 블록 수식 처리
          result += `\n$$\n${content}\n$$\n`;

          if (afterContent) {
            result += `${afterContent}\n`; // 일반 본문 처리
          }
        }

        buffer = '';
        isMathBlock = false;
        isQuoteBlock = false;
      } else {
        // 시작 기호 ($$) 발견 → 블록 시작
        if (current.trimStart().startsWith('> $$') || current.trimStart().startsWith('>$$')) {
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
