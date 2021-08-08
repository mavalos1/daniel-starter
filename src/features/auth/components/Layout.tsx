export type LayoutProps = {
  title: string;
};

const Layout: React.FC<LayoutProps> = ({ title, children }) => (
  <>
    {title}
    {children}
  </>
);

export default Layout;
