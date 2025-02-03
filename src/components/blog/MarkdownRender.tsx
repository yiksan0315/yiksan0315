import matter from 'gray-matter';
import 'katex/dist/katex.min.css';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeKatex from 'rehype-katex';
// import rehypeMathjax from 'rehype-mathjax';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

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

const MarkdownRender = ({ children, fileName, url }: MarkdownViewProps) => {
  const { data, content } = matter(children);
  const createdDate = formatDate(data.created);
  const updatedDate = formatDate(data.created);

  const filePath = decodeURIComponent(url);
  return (
    <div className=''>
      <div className='flex flex-col'>
        <p className='font-black my-4 text-5xl'>{fileName}</p>
        <Link href={`/Study/${url}`}>{filePath}</Link>
        <div className='flex flex-col my-2'>
          <span className='font-bold '>created : {createdDate}</span>
          <span className='font-bold '>updated : {updatedDate}</span>
        </div>
      </div>
      <hr></hr>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        // rehypePlugins={[rehypeRaw, rehypeMathjax]}
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
              <blockquote className='p-2 mb-2 bg-slate-100 rounded-sm border-l-cyan-700 border-l-8'>
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return <h1 className='text-4xl font-bold mt-6 mb-2'>{children}</h1>;
          },
          h2({ children }) {
            return <h2 className='text-3xl font-bold mt-6 mb-2'>{children}</h2>;
          },
          h3({ children }) {
            return <h3 className='text-2xl font-bold mt-6 mb-2'>{children}</h3>;
          },
          strong({ children }) {
            return <strong className='font-black text-cyan-500'>{children}</strong>;
          },
          li({ children }) {
            return <li className='list-disc ml-4'>{children}</li>;
          },
          a({ children, href }) {
            return (
              <Link href={href as string} className='text-cyan-900 underline'>
                {children}
              </Link>
            );
          },
          p({ children }) {
            return <p className='my-4'>{children}</p>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRender;
