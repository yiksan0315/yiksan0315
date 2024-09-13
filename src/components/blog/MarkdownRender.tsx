import matter from 'gray-matter';
import 'katex/dist/katex.min.css';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { CodeProps } from 'react-markdown/lib/ast-to-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface MarkdownViewProps {
  children: string;
  fileName: string;
  filePath: string;
}

interface ChildrenProps {
  children: string;
}

interface LinkProps extends ChildrenProps {
  href: string;
}

const components = {
  code({ node, className, children, ...props }: CodeProps) {
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
  blockquote({ children }: ChildrenProps) {
    return (
      <blockquote className='p-2 mb-2 bg-slate-900 text-white rounded-sm'>
        {children}
      </blockquote>
    );
    // return <ObsidianCallout>{children}</ObsidianCallout>;
  },
  h1({ children }: ChildrenProps) {
    return <h1 className='text-4xl font-bold mt-6 mb-2'>{children}</h1>;
  },
  h2({ children }: ChildrenProps) {
    return <h2 className='text-3xl font-bold mt-6 mb-2'>{children}</h2>;
  },
  h3({ children }: ChildrenProps) {
    return <h2 className='text-3xl font-bold mt-6 mb-2'>{children}</h2>;
  },
  strong({ children }: ChildrenProps) {
    return <strong className='font-black text-cyan-500'>{children}</strong>;
  },
  li({ children }: ChildrenProps) {
    return <li className='list-disc ml-4'>{children}</li>;
  },
  a({ children, href }: LinkProps) {
    return (
      <Link href={href} className='text-cyan-900 underline'>
        {children}
      </Link>
    );
  },
};

const MarkdownRender = ({
  children,
  fileName,
  filePath,
}: MarkdownViewProps) => {
  const { data, content } = matter(children);

  const filePathNew = filePath
    .replaceAll('/', '>')
    .replaceAll('%20', ' ')
    .replace('.md', '');
  const fileNameNew = fileName.replaceAll('%20', ' ').replace('.md', '');
  return (
    <div className=''>
      <div className='flex flex-col'>
        <h1 className='font-black my-4 text-5xl'>{fileNameNew}</h1>
        <Link href={`/blog/${filePath}`}>{filePathNew}</Link>
        <div className='flex flex-col my-2'>
          <span className='font-bold '>created : {data.created}</span>
          <span className='font-bold '>updated : {data.updated}</span>
        </div>
      </div>
      <hr></hr>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRender;
