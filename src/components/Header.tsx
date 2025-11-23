import Link from 'next/link';

const MarginedLi = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <li className='mx-4'>{children}</li>;
};

const Header = () => {
  return (
    <>
      <div className='flex justify-between p-2'>
        <span className='text-primary'>Yiksan0315&apos;s Blog</span>
        <ul className='flex flew-row'>
          <MarginedLi>
            <Link href='/'>Home</Link>
          </MarginedLi>
          <MarginedLi>
            <Link href='/CV'>CV</Link>
          </MarginedLi>
          <MarginedLi>
            <Link href='/Study'>Study</Link>
          </MarginedLi>
          <MarginedLi>
            <Link href='/Portfolio'>Portfolio</Link>
          </MarginedLi>
        </ul>
      </div>
      <hr />
    </>
  );
};

export default Header;
