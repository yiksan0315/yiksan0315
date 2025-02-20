import Link from 'next/link';

const UrlLinkComponent = ({ children }: { children: string }) => {
  const slug = children.split('/');
  const slugList = slug.reduce(
    (acc: { url: string; label: string }[], part, index) => {
      acc.push({ url: acc[index].url + '/' + part, label: part });
      return acc;
    },
    [{ url: '/Study', label: 'Study' }]
  );

  return (
    <div className='mt-4 mb-2'>
      {slugList.map((item, index) => {
        return (
          <>
            <Link key={item.url} href={item.url} className='text-violet-500 underline font-bold text-lg'>
              {item.label}
            </Link>
            <span>{index !== slugList.length - 1 ? ' / ' : ''}</span>
          </>
        );
      })}
    </div>
  );
};

export default UrlLinkComponent;
