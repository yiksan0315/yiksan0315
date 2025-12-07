import 'katex/dist/katex.css';
import matter from 'gray-matter';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import UrlLinkComponent from '../../components/Study/UrlLinkComponent';
import { removeExt, transformImageLinks } from '@/lib/markdown/remakeMarkdown';
import { blockMathConverter } from '@/lib/markdown/remakeMarkdown';
import remarkCallout from '@r4ai/remark-callout';
import '@styles/callout.css';
import TocContainer from './TocContainer';

interface MarkdownViewProps {
  children: string;
  fileName: string;
  url: string;
}

function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) {
    return 'No Date Info.';
  }
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(date);
}

const MarkdownPage = ({ children, fileName, url }: MarkdownViewProps) => {
  const { data, content } = matter(children);
  const createdDate = formatDate(data.created);
  const updatedDate = formatDate(data.updated);
  const aliases = data.aliases;
  const tags = data.tags;

  const urlToSameFolder = url.split('/').slice(0, -1).join('/');
  const newContent = blockMathConverter(transformImageLinks(content, `/api/Study-img/${urlToSameFolder}`)); // for mathjax test
  // const newContent = transformImageLinks(content, `/api/Study-img/${urlToSameFolder}`);

  const fileUrl = decodeURIComponent(url);
  return (
    <article className='flex flex-col w-[876px] mx-auto bg-white p-10 font-RIDIFont'>
      <header className='flex flex-col'>
        <p className='font-black text-5xl'>{removeExt(fileName)}</p>
        {aliases && (
          <ul className='flex flex-row flex-wrap items-center'>
            <li>{'or'}</li>
            {(aliases as string[]).map((item, index) => {
              return (
                <li key={item} className='text-xl mx-1'>
                  {item}
                  {index < aliases.length - 1 && ','}
                </li>
              );
            })}
          </ul>
        )}
        <UrlLinkComponent>{fileUrl}</UrlLinkComponent>
        <time className='flex flex-row justify-between w-8/12'>
          <span className='font-bold '>Create : {createdDate}</span>
          <span className='font-bold '>Update : {updatedDate}</span>
        </time>
        <div className='flex flex-row flex-wrap items-center p-2'>
          <p className='text-xl font-bold'># Tag: </p>
          {tags && (
            <ul className='flex flex-row'>
              {(tags as string[]).map((item) => {
                return (
                  <li key={item} className='rounded-full bg-slate-200 p-2 mx-4'>
                    {item}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <hr />
      </header>

      <div>
        <TocContainer />

        <ReactMarkdown
          remarkPlugins={[
            remarkParse,
            [
              remarkCallout,
              {
                titleInner: () => {
                  // https://r4ai.github.io/remark-callout/docs/en/api-reference/type-aliases/options/#titleinner
                  return { tagName: 'span', properties: { dataCalloutTitleInner: true } };
                },
              },
            ],
            [remarkMath, { singleDollarTextMath: true }],
            remarkGfm,
          ]}
          rehypePlugins={[[rehypeKatex, { displayMode: true, throwOnError: false, output: 'html', strict: false }]]}
          components={{
            code({ node, className, children, ref, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  className='rounded-lg'
                  language={match[1]}
                  PreTag='div'
                  {...props}
                  style={materialDark}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...props}>{children}</code>
              );
            },
            blockquote({ children }) {
              return (
                <blockquote className='px-1 py-0.5 mb-2 bg-slate-100  border-l-violet-500 border-l-8'>
                  {children}
                </blockquote>
              );
            },
            h1({ children }) {
              return <h1 className='text-5xl font-extrabold mt-6 mb-2'>{children}</h1>;
            },
            h2({ children }) {
              return (
                <h2 className='text-4xl font-black mt-6 mb-2 text-red-400'>
                  {children}
                  <hr />
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className='text-3xl font-bold mt-6 mb-2'>
                  {children}
                  <hr />
                </h3>
              );
            },
            h4({ children }) {
              return (
                <h4 className='text-2xl font-bold mt-6 mb-2'>
                  {children}
                  <hr />
                </h4>
              );
            },
            h5({ children }) {
              return (
                <h5 className='text-xl font-bold mt-6 mb-2'>
                  {children}
                  <hr />
                </h5>
              );
            },
            h6({ children }) {
              return (
                <h6 className='text-lg font-bold mt-6 mb-2'>
                  {children}
                  <hr />
                </h6>
              );
            },
            ul({ children }) {
              return <ul className='list-disc ml-8'>{children}</ul>;
            },
            ol({ children }) {
              return <ol className='list-disc ml-8'>{children}</ol>;
            },
            li({ children }) {
              return <li className='my-2'>{children}</li>;
            },
            a({ children, href }) {
              return (
                <Link href={href as string} className='text-violet-500 underline'>
                  {children}
                </Link>
              );
            },
            p({ children }) {
              return <p className='my-4 leading-relaxed'>{children}</p>;
            },

            strong({ children }) {
              return <strong className='font-bold text-red-600'>{children}</strong>;
            },
            em({ children }) {
              return <em className='italic text-green-600'>{children}</em>;
            },
            img({ src, alt }) {
              if (!src) {
                alt = 'No Image';
                src = '/images/no-image.png';
              }
              return (
                <Image
                  src={src}
                  alt={alt as string}
                  className='w-8/12 h-auto mx-auto my-2 object-cover rounded-lg border-2 border-gray-200 shadow-lg'
                  placeholder='blur'
                  blurDataURL='/images/loading-bar.png'
                  width={200}
                  height={200}
                />
              );
            },
            table({ children }) {
              return <table className=' mx-auto border-2 text-center border-slate-300 shadow-sm'>{children}</table>;
            },
            thead({ children }) {
              return <thead className='bg-teal-100'>{children}</thead>;
            },
            tbody({ children }) {
              // table : body
              return <tbody className='divide-y divide-slate-200'>{children}</tbody>;
            },
            tr({ children }) {
              // table : row
              return <tr className='divide-x divide-slate-200'>{children}</tr>;
            },
            td({ children }) {
              // table data : row contents
              return <td className='p-1'>{children}</td>;
            },
            th({ children }) {
              //table heading : row or column title
              return <th className='p-2'>{children}</th>;
            },
          }}
        >
          {newContent}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default MarkdownPage;
