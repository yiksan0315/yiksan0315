import { removeExt } from '@/lib/markdown/remakeMarkdown';
import Link from 'next/link';

const UrlLinkComponent = ({ children }: { children: string }) => {
  const slug = children.split('/');
  const slugList = slug.reduce(
    (acc: { url: string; label: string }[], part, index) => {
      acc.push({ url: acc[index].url + '/' + part, label: index !== slug.length - 1 ? part : removeExt(part) });
      return acc;
    },
    [{ url: '/Study', label: 'Study' }]
  );

  return (
    <div className='mt-4 mb-2 flex flex-row flex-wrap'>
      {slugList.map((item, index) => {
        return (
          <div key={item.url}>
            <Link href={item.url} className='text-violet-500 underline font-bold text-lg'>
              {item.label}
            </Link>
            <span>{index !== slugList.length - 1 ? ' / ' : ''}</span>
          </div>
        );
      })}
    </div>
  );
};

export default UrlLinkComponent;
