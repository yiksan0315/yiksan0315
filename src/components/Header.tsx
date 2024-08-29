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
    <div className='flex justify-between bg-blue-300 p-4'>
      <span>익산이의 블로그</span>
      <ul className='flex flew-row'>
        <MarginedLi>
          <Link href='/'>Home</Link>
        </MarginedLi>
        <MarginedLi>
          <Link href='/blog'>Blog</Link>
        </MarginedLi>
        <MarginedLi>
          <Link href='/portfolio'>portfolio</Link>
        </MarginedLi>
      </ul>
    </div>
  );
};

export default Header;
