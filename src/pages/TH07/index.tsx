import React, { useState, useEffect, useRef } from 'react';
import {
  ConfigProvider, Layout, Menu, Typography, Card, Row, Col, Tag, Input, Pagination,
  Button, Table, Form, Modal, Select, Popconfirm, Space, Avatar,
  Divider, Badge, Statistic, Tooltip, message, Empty,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  HomeOutlined, FileTextOutlined, UserOutlined,
  TagsOutlined, SearchOutlined, EyeOutlined, CalendarOutlined,
  EditOutlined, DeleteOutlined, PlusOutlined, ArrowLeftOutlined,
  GithubOutlined, TwitterOutlined, LinkedinOutlined, LinkOutlined,
  ReadOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface TagItem {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[];
  status: 'draft' | 'published';
  author: string;
  createdAt: string;
  views: number;
}

type PageKey = 'home' | 'post-detail' | 'about' | 'manage-posts' | 'manage-tags';

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const SEED_TAGS: TagItem[] = [
  { id: 't1', name: 'React' },
  { id: 't2', name: 'TypeScript' },
  { id: 't3', name: 'Node.js' },
  { id: 't4', name: 'CSS' },
  { id: 't5', name: 'UX Design' },
  { id: 't6', name: 'Performance' },
  { id: 't7', name: 'Testing' },
  { id: 't8', name: 'DevOps' },
];

const SEED_POSTS: Post[] = [
  {
    id: 'p11', title: 'Next.js 14: App Router và Server Actions', slug: 'nextjs-14-app-router-server-actions',
    summary: 'Tìm hiểu cách xây dựng ứng dụng fullstack hiện đại với Next.js 14, tận dụng tối đa Server Components.',
    content: `## App Router là gì?\n\nApp Router giới thiệu một mô hình lập trình mới dựa trên React Server Components.\n\n## Server Actions\n\nThay vì viết API route, bạn có thể định nghĩa hàm chạy trên server ngay trong component:\n\n\`\`\`typescript\nasync function createInvoice(formData: FormData) {\n  'use server';\n  // logic xử lý database\n}\n\`\`\`\n\n## Caching trong Next.js\n\nNext.js tự động cache dữ liệu ở nhiều tầng để tối ưu tốc độ.`,
    coverImage: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&h=400&fit=crop',
    tags: ['t1', 't3'], status: 'published', author: 'Nguyễn Duy Yên',
    createdAt: '2024-04-01', views: 2150,
  },
  {
    id: 'p12', title: 'Docker cơ bản cho Web Developer', slug: 'docker-basic-web-dev',
    summary: 'Cách đóng gói ứng dụng của bạn vào container để chạy ổn định trên mọi môi trường từ dev đến production.',
    content: `## Tại sao cần Docker?\n\n"It works on my machine" không còn là lời bào chữa nữa khi bạn dùng Docker.\n\n## Dockerfile mẫu\n\n\`\`\`dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["npm", "start"]\n\`\`\`\n\n## Docker Compose\n\nQuản lý nhiều container (app, db, redis) cùng lúc một cách dễ dàng.`,
    coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b193ef5?w=800&h=400&fit=crop',
    tags: ['t8', 't3'], status: 'published', author: 'Phạm Hải Đăng',
    createdAt: '2024-04-05', views: 1540,
  },
  {
    id: 'p13', title: 'Tailwind CSS: Tư duy Utility-First', slug: 'tailwind-css-utility-first',
    summary: 'Tại sao Tailwind lại trở thành chuẩn mực mới trong thiết kế giao diện web hiện đại.',
    content: `## Khái niệm Utility-First\n\nThay vì viết hàng trăm dòng CSS, bạn sử dụng các class có sẵn để build giao diện.\n\n## Ưu điểm\n\n- Không tốn thời gian đặt tên class.\n- File CSS cuối cùng cực nhẹ nhờ PurgeCSS.\n- Dễ dàng maintain giao diện responsive.\n\n## Custom Config\n\n\`\`\`javascript\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: { 'brand': '#3b82f6' }\n    }\n  }\n}\n\`\`\``,
    coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=400&fit=crop',
    tags: ['t4'], status: 'published', author: 'Nguyễn Duy Tư',
    createdAt: '2024-04-08', views: 890,
  },
  {
    id: 'p14', title: 'Học SQL trong 10 phút', slug: 'hoc-sql-nhanh',
    summary: 'Nắm vững các câu lệnh SQL cơ bản: SELECT, INSERT, UPDATE, DELETE và JOIN.',
    content: `## SELECT và Filter\n\n\`\`\`sql\nSELECT name, email FROM users WHERE age > 18;\n\`\`\`\n\n## JOIN bảng\n\nKết nối dữ liệu từ nhiều nguồn khác nhau:\n- INNER JOIN\n- LEFT JOIN\n- RIGHT JOIN\n\n## Aggregate Functions\n\nSử dụng SUM, AVG, COUNT để thống kê dữ liệu nhanh chóng.`,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
    tags: ['t3'], status: 'published', author: 'Phạm Hải Đăng',
    createdAt: '2024-04-10', views: 3200,
  },
  {
    id: 'p15', title: 'Authentication với NextAuth.js', slug: 'nextauth-js-guide',
    summary: 'Tích hợp đăng nhập bằng Google, Facebook, GitHub vào ứng dụng React chỉ trong vài bước.',
    content: `## NextAuth.js là gì?\n\nThư viện hỗ trợ authentication bảo mật và dễ dùng nhất cho Next.js.\n\n## Cấu hình Provider\n\n\`\`\`typescript\nproviders: [\n  GoogleProvider({\n    clientId: process.env.GOOGLE_ID,\n    clientSecret: process.env.GOOGLE_SECRET,\n  }),\n]\n\`\`\`\n\n## Quản lý Session\n\nSử dụng hook \`useSession()\` ở client hoặc \`getServerSession()\` ở server.`,
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop',
    tags: ['t1', 't3'], status: 'published', author: 'Nguyễn Duy Yên',
    createdAt: '2024-04-12', views: 1120,
  },
  {
    id: 'p16', title: 'Redis: Từ Caching đến Message Broker', slug: 'redis-complete-guide',
    summary: 'Khám phá sức mạnh của in-memory database để tăng tốc độ phản hồi cho server của bạn.',
    content: `## Redis là gì?\n\nMột hệ thống lưu trữ cấu trúc dữ liệu trong RAM với tốc độ cực cao.\n\n## Các kiểu dữ liệu\n\n- String\n- Hash\n- List\n- Set\n- Sorted Set\n\n## Pub/Sub Pattern\n\nSử dụng Redis để làm trung gian truyền tin giữa các microservices.`,
    coverImage: 'https://images.unsplash.com/photo-1599507591144-66b1074d025b?w=800&h=400&fit=crop',
    tags: ['t3', 't8'], status: 'published', author: 'Phạm Hải Đăng',
    createdAt: '2024-04-15', views: 670,
  },
  {
    id: 'p17', title: 'Git Tips: Rebasing vs Merging', slug: 'git-rebase-vs-merge',
    summary: 'Hiểu rõ sự khác biệt giữa Rebase và Merge để giữ lịch sử commit của team luôn sạch sẽ.',
    content: `## Git Merge\n\nTạo ra một commit gộp mới. An toàn nhưng làm rối lịch sử nếu có quá nhiều branch.\n\n## Git Rebase\n\nDi chuyển base của branch lên đầu branch chính. Lịch sử dạng đường thẳng tắp.\n\n## Khi nào dùng cái nào?\n\n- **Merge**: Khi muốn giữ nguyên vết tích các branch.\n- **Rebase**: Trước khi push code lên repo chung để tránh merge commit thừa.`,
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=400&fit=crop',
    tags: ['t8'], status: 'published', author: 'Nguyễn Duy Tư',
    createdAt: '2024-04-18', views: 945,
  },
  {
    id: 'p18', title: 'Lập trình hướng đối tượng (OOP) với TypeScript', slug: 'oop-with-typescript',
    summary: 'Áp dụng 4 tính chất của OOP: Đóng gói, Kế thừa, Đa hình và Trừu tượng vào TypeScript.',
    content: `## Class và Access Modifiers\n\nSử dụng \`public\`, \`private\`, \`protected\` để bảo vệ dữ liệu.\n\n## Interface và Abstract Class\n\n\`\`\`typescript\nabstract class Animal {\n  abstract makeSound(): void;\n}\n\`\`\`\n\n## Dependency Injection\n\nViết code dễ test hơn bằng cách inject dependencies qua constructor.`,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    tags: ['t2'], status: 'published', author: 'Phạm Hải Đăng',
    createdAt: '2024-04-20', views: 730,
  },
  {
    id: 'p19', title: 'Xây dựng REST API với Express và Prisma', slug: 'rest-api-express-prisma',
    summary: 'Cách dùng Prisma ORM để thao tác với database một cách type-safe trong Node.js.',
    content: `## Prisma Schema\n\nĐịnh nghĩa database model trong file \`schema.prisma\` cực kỳ trực quan.\n\n## CRUD Operations\n\n\`\`\`typescript\nconst user = await prisma.user.create({\n  data: { email: 'abc@gmail.com', name: 'ABC' }\n});\n\`\`\`\n\n## Migrations\n\nTự động hóa việc thay đổi cấu trúc database mà không sợ mất dữ liệu.`,
    coverImage: 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=800&h=400&fit=crop',
    tags: ['t3', 't2'], status: 'published', author: 'Nguyễn Duy Yên',
    createdAt: '2024-04-22', views: 560,
  },
  {
    id: 'p20', title: 'SEO cho Single Page Application (SPA)', slug: 'seo-for-spa',
    summary: 'Các kỹ thuật giúp ứng dụng React/Vue của bạn leo rank Google hiệu quả hơn.',
    content: `## Vấn đề của SPA\n\nBot của Google đôi khi khó đọc nội dung được render bằng Javascript.\n\n## Giải pháp\n\n- **SSR (Server Side Rendering)**: Dùng Next.js hoặc Nuxt.js.\n- **Metadata**: Cập nhật title, description động.\n- **Dynamic Rendering**: Trả về HTML tĩnh cho Bot.\n\n## Google Search Console\n\nCông cụ không thể thiếu để theo dõi sức khỏe SEO của website.`,
    coverImage: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d8?w=800&h=400&fit=crop',
    tags: ['t1', 't5'], status: 'draft', author: 'Nguyễn Duy Tư',
    createdAt: '2024-04-25', views: 0,
  },
];

// ─── MARKDOWN RENDERER ────────────────────────────────────────────────────────

function renderMarkdown(md: string): string {
  return md
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre style="background:#f5f5f5;border:1px solid #d9d9d9;padding:16px;border-radius:6px;overflow-x:auto;margin:16px 0;font-size:13px;line-height:1.6"><code>$1</code></pre>')
    .replace(/^### (.+)$/gm, '<h3 style="margin:20px 0 8px;font-size:16px;font-weight:600">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="margin:24px 0 12px;font-size:20px;font-weight:700;border-bottom:1px solid #f0f0f0;padding-bottom:8px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="margin:32px 0 16px;font-size:26px;font-weight:800">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#fff1f0;color:#cf1322;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px">$1</code>')
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, (m: string) => `<ul style="padding-left:24px;margin:8px 0">${m}</ul>`)
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

// ─── TAG COLOR HELPER ─────────────────────────────────────────────────────────

const TAG_COLORS = ['red', 'volcano', 'orange', 'gold', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'magenta'] as const;

function getTagColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return TAG_COLORS[Math.abs(h) % TAG_COLORS.length];
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App(): React.ReactElement {
  const [page, setPage] = useState<PageKey>('home');
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [tags, setTags] = useState<TagItem[]>(SEED_TAGS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const PAGE_SIZE = 9;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPageNum(1);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const navigate = (p: PageKey, post?: Post): void => {
    setPage(p);
    if (post) {
      setSelectedPost(post);
      setPosts(prev => prev.map(pp => pp.id === post.id ? { ...pp, views: pp.views + 1 } : pp));
    }
    window.scrollTo(0, 0);
  };

  const publishedPosts = posts.filter(p => p.status === 'published');

  const filteredPosts = publishedPosts.filter(p => {
    const matchSearch = !debouncedSearch
      || p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      || p.summary.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchTag = !selectedTag || p.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const pagedPosts = filteredPosts.slice((currentPageNum - 1) * PAGE_SIZE, currentPageNum * PAGE_SIZE);

  const getTagName = (id: string): string => tags.find(t => t.id === id)?.name ?? id;

  const currentPost = selectedPost ? posts.find(p => p.id === selectedPost.id) : undefined;

  return (
    <ConfigProvider>
  <Layout style={{ 
    minHeight: '100vh', 
    background: 'linear-gradient(135deg, #f6f9fc, #eef2f7)' 
  }}>

    {/* HEADER */}
    <Header 
      style={{ 
        background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e5e7eb', 
        padding: '0 24px', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)' 
      }}
    >
      
      {/* LOGO */}
      <div
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8, 
          marginRight: 40, 
          cursor: 'pointer' 
        }}
        onClick={() => navigate('home')}
      >
        <ReadOutlined style={{ color: '#6366f1', fontSize: 22 }} />
        <Text strong style={{ fontSize: 18, color: '#4f46e5' }}>
          DevBlog
        </Text>
      </div>

      {/* MENU */}
      <Menu
        mode="horizontal"
        selectedKeys={[page]}
        style={{ 
          flex: 1, 
          border: 'none', 
          lineHeight: '64px',
          background: 'transparent'
        }}
        onClick={({ key }) => navigate(key as PageKey)}
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          Trang chủ
        </Menu.Item>

        <Menu.Item key="about" icon={<UserOutlined />}>
          Giới thiệu
        </Menu.Item>

        <Menu.Item key="manage-posts" icon={<FileTextOutlined />}>
          Quản lý bài viết
        </Menu.Item>

        <Menu.Item key="manage-tags" icon={<TagsOutlined />}>
          Quản lý thẻ
        </Menu.Item>
      </Menu>

    </Header>

    {/* CONTENT */}
    <Content style={{ padding: '0 0 48px' }}>
      {page === 'home' && (
        <HomePage
          posts={pagedPosts}
          allPosts={filteredPosts}
          tags={tags}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTag={selectedTag}
          setSelectedTag={(t: string) => { 
            setSelectedTag(t); 
            setCurrentPageNum(1); 
          }}
          currentPage={currentPageNum}
          setCurrentPage={setCurrentPageNum}
          pageSize={PAGE_SIZE}
          navigate={navigate}
          getTagName={getTagName}
        />
      )}

      {page === 'post-detail' && currentPost && (
        <PostDetailPage
          post={currentPost}
          posts={posts}
          navigate={navigate}
          getTagName={getTagName}
        />
      )}

      {page === 'about' && <AboutPage />}

      {page === 'manage-posts' && (
        <ManagePostsPage
          posts={posts}
          setPosts={setPosts}
          tags={tags}
          getTagName={getTagName}
        />
      )}

      {page === 'manage-tags' && (
        <ManageTagsPage 
          tags={tags} 
          setTags={setTags} 
          posts={posts} 
        />
      )}
    </Content>

    {/* FOOTER */}
    <Footer 
      style={{ 
        textAlign: 'center', 
        background: 'rgba(255,255,255,0.9)', 
        borderTop: '1px solid #e5e7eb', 
        padding: '18px 24px',
        backdropFilter: 'blur(6px)'
      }}
    >
      <Text type="secondary" style={{ fontSize: 13 }}>
        DevBlog — Xây dựng bằng React & Ant Design · © 2026 Nguyễn Duy Tư
      </Text>
    </Footer>

  </Layout>
</ConfigProvider>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

interface HomePageProps {
  posts: Post[];
  allPosts: Post[];
  tags: TagItem[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedTag: string;
  setSelectedTag: (v: string) => void;
  currentPage: number;
  setCurrentPage: (n: number) => void;
  pageSize: number;
  navigate: (p: PageKey, post?: Post) => void;
  getTagName: (id: string) => string;
}

function HomePage({
  posts, allPosts, tags, searchQuery, setSearchQuery,
  selectedTag, setSelectedTag, currentPage, setCurrentPage,
  pageSize, navigate, getTagName,
}: HomePageProps): React.ReactElement {
  return (
    <>
      <div style={{ 
  background: 'linear-gradient(135deg, #f6f9fc, #eef2f7)', 
  borderBottom: '1px solid #e5e7eb', 
  padding: '36px 24px' 
}}>
  <div style={{ maxWidth: 1200, margin: '0 auto' }}>
    
    <Title level={2} style={{ margin: '0 0 6px', color: '#4f46e5' }}>
      <ReadOutlined style={{ marginRight: 8 }} />
      Khám phá kiến thức
    </Title>

    <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
      Chia sẻ kinh nghiệm thực tiễn về lập trình và thiết kế
    </Text>

    <Input
      placeholder="Tìm kiếm bài viết..."
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      style={{ 
        maxWidth: 480,
        borderRadius: 12,
        padding: '6px 10px'
      }}
      size="large"
      allowClear
      prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
    />
  </div>
</div>

<div style={{ 
  maxWidth: 1200, 
  margin: '0 auto', 
  padding: '28px 20px 0' 
}}>
  
  {/* FILTER */}
  <div style={{ 
    marginBottom: 18, 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: 10, 
    alignItems: 'center' 
  }}>
    <Text type="secondary" style={{ fontSize: 13 }}>
      Lọc theo thẻ:
    </Text>

    <Tag
      onClick={() => setSelectedTag('')}
      style={{ 
        cursor: 'pointer', 
        borderRadius: 20, 
        padding: '4px 14px',
        background: !selectedTag ? '#6366f1' : '#f3f4f6',
        color: !selectedTag ? '#fff' : '#555',
        border: 'none',
        fontWeight: 500
      }}
    >
      Tất cả
    </Tag>

    {tags.map(tag => (
      <Tag
        key={tag.id}
        onClick={() => setSelectedTag(tag.id)}
        style={{ 
          cursor: 'pointer', 
          borderRadius: 20, 
          padding: '4px 14px',
          background: selectedTag === tag.id ? '#6366f1' : '#f3f4f6',
          color: selectedTag === tag.id ? '#fff' : '#555',
          border: 'none',
          fontWeight: 500
        }}
      >
        {tag.name}
      </Tag>
    ))}
  </div>

  <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 20 }}>
    Hiển thị {allPosts.length} bài viết
  </Text>

  {/* EMPTY */}
  {posts.length === 0 ? (
    <Empty 
      description="Không tìm thấy bài viết nào" 
      style={{ margin: '60px 0' }} 
    />
  ) : (
    
    <Row gutter={[18, 18]}>
      {posts.map(post => (
        <Col key={post.id} xs={24} sm={12} lg={8}>
          
          <Card
            hoverable
            cover={
              <img
                alt={post.title}
                src={post.coverImage}
                style={{ 
                  height: 190, 
                  objectFit: 'cover' 
                }}
              />
            }
            onClick={() => navigate('post-detail', post)}
            style={{ 
              borderRadius: 16, 
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
              transition: 'all 0.25s ease'
            }}
            bodyStyle={{ padding: 18 }}
          >
            
            <div style={{ marginBottom: 10 }}>
              {post.tags.slice(0, 2).map(tid => (
                <Tag 
                  key={tid} 
                  style={{ 
                    borderRadius: 20, 
                    fontSize: 11,
                    background: '#eef2ff',
                    color: '#4f46e5',
                    border: 'none'
                  }}
                >
                  {getTagName(tid)}
                </Tag>
              ))}
            </div>

            <div style={{ 
              fontWeight: 600, 
              fontSize: 15, 
              lineHeight: 1.5, 
              margin: '6px 0',
              overflow: 'hidden', 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical',
              color: '#111827'
            }}>
              {post.title}
            </div>

            <div style={{ 
              fontSize: 13, 
              color: '#6b7280', 
              marginBottom: 14,
              overflow: 'hidden', 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical'
            }}>
              {post.summary}
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderTop: '1px solid #eee', 
              paddingTop: 12 
            }}>
              
              <Space size={6}>
                <Avatar 
                  size={24} 
                  style={{ 
                    background: '#6366f1', 
                    fontSize: 11 
                  }}
                >
                  {post.author[0]}
                </Avatar>

                <Text style={{ fontSize: 12, color: '#555' }}>
                  {post.author}
                </Text>
              </Space>

              <Space size={10}>
                <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                  <CalendarOutlined /> {post.createdAt}
                </Text>

                <Text style={{ fontSize: 12, color: '#9ca3af' }}>
                  <EyeOutlined /> {post.views}
                </Text>
              </Space>

            </div>

          </Card>
        </Col>
      ))}
    </Row>
  )}

  {/* PAGINATION */}
  {allPosts.length > pageSize && (
    <div style={{ textAlign: 'center', marginTop: 36 }}>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={allPosts.length}
        onChange={setCurrentPage}
        showSizeChanger={false}
      />
    </div>
  )}

</div></>
  );
}

// ─── POST DETAIL PAGE ─────────────────────────────────────────────────────────

interface PostDetailPageProps {
  post: Post;
  posts: Post[];
  navigate: (p: PageKey, post?: Post) => void;
  getTagName: (id: string) => string;
}

function PostDetailPage({ post, posts, navigate, getTagName }: PostDetailPageProps): React.ReactElement {
  const related = posts
    .filter(p => p.id !== post.id && p.status === 'published' && p.tags.some(t => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <div style={{ 
  maxWidth: 1200, 
  margin: '0 auto', 
  padding: '32px 20px 0',
  background: 'linear-gradient(135deg, #f6f9fc, #eef2f7)'
}}>
  <Button
    icon={<ArrowLeftOutlined />}
    onClick={() => navigate('home')}
    style={{ 
      marginBottom: 20,
      borderRadius: 10,
      border: 'none',
      background: '#eef2ff',
      color: '#4f46e5',
      fontWeight: 500
    }}
  >
    Quay lại
  </Button>

  <Row gutter={24}>
    
    {/* MAIN */}
    <Col xs={24} lg={17}>
      <Card 
        style={{ 
          borderRadius: 16, 
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }} 
        bodyStyle={{ padding: 28 }}
      >
        <div style={{ marginBottom: 16 }}>
          {post.tags.map(tid => (
            <Tag 
              key={tid} 
              style={{ 
                borderRadius: 20,
                background: '#eef2ff',
                color: '#4f46e5',
                border: 'none'
              }}
            >
              {getTagName(tid)}
            </Tag>
          ))}
        </div>

        <Title level={2} style={{ margin: '8px 0 16px' }}>
          {post.title}
        </Title>

        <Space size={20} style={{ marginBottom: 20 }}>
          <Space size={8}>
            <Avatar style={{ background: '#6366f1' }}>
              {post.author[0]}
            </Avatar>
            <Text strong>{post.author}</Text>
          </Space>

          <Text type="secondary">
            <CalendarOutlined /> {post.createdAt}
          </Text>

          <Text type="secondary">
            <EyeOutlined /> {post.views} lượt xem
          </Text>
        </Space>

        <Divider style={{ margin: '0 0 20px' }} />

        <img
          src={post.coverImage}
          alt={post.title}
          style={{ 
            width: '100%', 
            borderRadius: 12, 
            marginBottom: 24, 
            maxHeight: 360, 
            objectFit: 'cover',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)'
          }}
        />

        <div
          style={{ 
            fontSize: 15, 
            lineHeight: 1.8, 
            color: '#374151' 
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </Card>

      {/* RELATED */}
      {related.length > 0 && (
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>
             Bài viết liên quan
          </Title>

          <Row gutter={[16, 16]}>
            {related.map(rp => (
              <Col key={rp.id} xs={24} sm={8}>
                <Card
                  hoverable
                  size="small"
                  cover={
                    <img 
                      src={rp.coverImage} 
                      alt={rp.title} 
                      style={{ height: 120, objectFit: 'cover' }} 
                    />
                  }
                  onClick={() => navigate('post-detail', rp)}
                  style={{ 
                    borderRadius: 16, 
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: 13, 
                    lineHeight: 1.4, 
                    overflow: 'hidden', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical' 
                  }}>
                    {rp.title}
                  </div>

                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <EyeOutlined /> {rp.views}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Col>

    {/* SIDEBAR */}
    <Col xs={24} lg={7}>
      <Card 
        style={{ 
          borderRadius: 16, 
          position: 'sticky', 
          top: 80,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }} 
        bodyStyle={{ padding: 20 }}
      >
        <Title level={5} style={{ marginBottom: 16 }}>
           Thông tin bài viết
        </Title>

        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar 
              size={48} 
              style={{ background: '#6366f1', flexShrink: 0 }}
            >
              {post.author[0]}
            </Avatar>

            <div>
              <Text strong style={{ display: 'block' }}>
                {post.author}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Tác giả
              </Text>
            </div>
          </div>

          <Divider style={{ margin: '4px 0' }} />

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Ngày đăng
            </Text>
            <br />
            <Text>{post.createdAt}</Text>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Lượt xem
            </Text>
            <br />
            <Text>{post.views}</Text>
          </div>

          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Thẻ
            </Text>

            <div style={{ marginTop: 6 }}>
              {post.tags.map(tid => (
                <Tag 
                  key={tid} 
                  style={{ 
                    borderRadius: 20, 
                    marginBottom: 4,
                    background: '#eef2ff',
                    color: '#4f46e5',
                    border: 'none'
                  }}
                >
                  {getTagName(tid)}
                </Tag>
              ))}
            </div>
          </div>

        </Space>
      </Card>
    </Col>

  </Row>
</div>);
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────

interface SocialLink {
  icon: React.ReactNode;
  label: string;
}

interface Experience {
  role: string;
  company: string;
  period: string;
  desc: string;
}

function AboutPage(): React.ReactElement {
  const skills: string[] = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'Redis', 'Next.js', 'Figma', 'CSS/Tailwind', 'Jest'];

  const socials: SocialLink[] = [
    { icon: <GithubOutlined />, label: 'GitHub' },
    { icon: <TwitterOutlined />, label: 'Twitter' },
    { icon: <LinkedinOutlined />, label: 'LinkedIn' },
    { icon: <LinkOutlined />, label: 'Website' },
  ];

  const experiences: Experience[] = [
    { role: 'Senior Frontend Developer', company: 'TechCorp Vietnam', period: '2022 – nay', desc: 'Xây dựng dashboard analytics với React, TypeScript và WebSocket.' },
    { role: 'Full-stack Developer', company: 'StartupXYZ', period: '2020 – 2022', desc: 'Phát triển REST API với Node.js và giao diện React cho SaaS platform.' },
    { role: 'Junior Developer', company: 'Agency ABC', period: '2018 – 2020', desc: 'Phát triển website và ứng dụng web cho khách hàng đa dạng.' },
  ];

  const stats: { label: string; value: string }[] = [
    { label: 'Bài viết', value: '50+' },
    { label: 'Lượt xem', value: '12K' },
    { label: 'Năm KN', value: '6+' },
  ];

  return (
   <div style={{ 
  maxWidth: 1200, 
  margin: '0 auto', 
  padding: '40px 20px',
  background: 'linear-gradient(135deg, #f6f9fc, #eef2f7)'
}}>
  <Row gutter={[24, 24]} justify="center">
    
    {/* LEFT */}
    <Col xs={24} md={7}>
      <Card 
        style={{ 
          textAlign: 'center', 
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(6px)',
          background: 'rgba(255,255,255,0.9)'
        }} 
        bodyStyle={{ padding: '36px 24px' }}
      >
        <Avatar
          size={100}
          src="https://avatarfiles.alphacoders.com/110/110487.png"
          style={{ 
            border: '4px solid #6366f1',
            marginBottom: 16,
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
          }}
        />

        <Title level={4} style={{ margin: '0 0 4px' }}>
          Nguyễn Duy Tư
        </Title>

        <Text type="secondary" style={{ fontSize: 13 }}>
          Full-stack Developer & Tech Writer
        </Text>

        <Divider />

        <Space size={12} style={{ justifyContent: 'center', width: '100%' }}>
          {socials.map(s => (
            <Tooltip key={s.label} title={s.label}>
              <Button 
                shape="circle" 
                icon={s.icon}
                style={{
                  border: 'none',
                  background: '#eef2ff',
                  color: '#6366f1'
                }}
              />
            </Tooltip>
          ))}
        </Space>

        <Divider />

        <Row gutter={8}>
          {stats.map(s => (
            <Col key={s.label} span={8}>
              <Statistic
                title={<span style={{ fontSize: 11 }}>{s.label}</span>}
                value={s.value}
                valueStyle={{ 
                  fontSize: 18, 
                  fontWeight: 700, 
                  color: '#6366f1' 
                }}
              />
            </Col>
          ))}
        </Row>
      </Card>
    </Col>

    {/* RIGHT */}
    <Col xs={24} md={17}>
      
      {/* ABOUT */}
      <Card 
        style={{ 
          marginBottom: 20, 
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
        }}
      >
        <Title level={4}>👋 Về tôi</Title>

        <Paragraph style={{ 
          fontSize: 14, 
          lineHeight: 1.8, 
          color: '#444', 
          marginBottom: 8 
        }}>
          Xin chào! Tôi là Nguyễn Duy Tư, một Full-stack Developer với hơn 6 năm kinh nghiệm xây dựng các ứng dụng web hiện đại.
          Tôi đam mê tạo ra những sản phẩm không chỉ hoạt động tốt về mặt kỹ thuật mà còn mang lại trải nghiệm người dùng tuyệt vời.
        </Paragraph>

        <Paragraph style={{ 
          fontSize: 14, 
          lineHeight: 1.8, 
          color: '#555', 
          marginBottom: 0 
        }}>
          Blog này là nơi tôi chia sẻ những kiến thức và kinh nghiệm tích lũy được trong quá trình làm việc thực tế.
        </Paragraph>
      </Card>

      {/* SKILLS */}
      <Card 
        style={{ 
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
        }}
      >
        <Title level={4}> Kỹ năng</Title>

        <div style={{ marginBottom: 16 }}>
          {skills.map(skill => (
            <Tag 
              key={skill} 
              style={{ 
                margin: '4px', 
                borderRadius: 20, 
                padding: '4px 14px',
                background: '#eef2ff',
                color: '#4f46e5',
                border: 'none',
                fontWeight: 500
              }}
            >
              {skill}
            </Tag>
          ))}
        </div>

        <Divider />

        <Title level={5}> Kinh nghiệm làm việc</Title>

        {experiences.map((exp, i) => (
          <div 
            key={i} 
            style={{ 
              padding: '14px 0', 
              borderBottom: i < experiences.length - 1 ? '1px solid #eee' : 'none'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start' 
            }}>
              
              <div>
                <Text strong>{exp.role}</Text>

                <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>
                  {exp.company}
                </Text>

                <Text type="secondary" style={{ fontSize: 13 }}>
                  {exp.desc}
                </Text>
              </div>

              <Tag 
                style={{ 
                  borderRadius: 20, 
                  whiteSpace: 'nowrap', 
                  marginLeft: 8,
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none'
                }}
              >
                {exp.period}
              </Tag>

            </div>
          </div>
        ))}
      </Card>
    </Col>

  </Row>
</div>
  );
}

// ─── MANAGE POSTS PAGE ────────────────────────────────────────────────────────

interface ManagePostsPageProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  tags: TagItem[];
  getTagName: (id: string) => string;
}

function ManagePostsPage({ posts, setPosts, tags, getTagName }: ManagePostsPageProps): React.ReactElement {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = (): void => {
    setEditingPost(null);
    form.resetFields();
    form.setFieldsValue({ status: 'draft' });
    setModalVisible(true);
  };

  const openEdit = (post: Post): void => {
    setEditingPost(post);
    form.setFieldsValue({ ...post });
    setModalVisible(true);
  };

  const handleDelete = (id: string): void => {
    setPosts(prev => prev.filter(p => p.id !== id));
    void message.success('Đã xóa bài viết');
  };

  const handleSubmit = async (): Promise<void> => {
    const values = await form.validateFields() as Partial<Post>;
    if (editingPost) {
      setPosts(prev => prev.map(p => p.id === editingPost.id ? { ...p, ...values } : p));
      void message.success('Đã cập nhật bài viết');
    } else {
      const newPost: Post = {
        id: `p${Date.now()}`,
        views: 0,
        author: 'Nguyễn Duy Tư',
        createdAt: new Date().toISOString().slice(0, 10),
        summary: ((values.content ?? '').replace(/[#*`]/g, '').slice(0, 120)) + '...',
        coverImage: values.coverImage ?? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
        title: values.title ?? '',
        slug: values.slug ?? '',
        content: values.content ?? '',
        tags: values.tags ?? [],
        status: (values.status as Post['status']) ?? 'draft',
      };
      setPosts(prev => [newPost, ...prev]);
      void message.success('Đã thêm bài viết mới');
    }
    setModalVisible(false);
  };

  const columns: ColumnsType<Post> = [
    {
      title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 130,
      render: (s: string) => s === 'published'
        ? <Badge status="success" text="Đã đăng" />
        : <Badge status="warning" text="Nháp" />,
    },
    {
      title: 'Thẻ', dataIndex: 'tags', key: 'tags', width: 200,
      render: (tids: string[]) => (
        <>
          {(tids ?? []).slice(0, 2).map(tid => (
            <Tag key={tid} color={getTagColor(getTagName(tid))} style={{ borderRadius: 20, fontSize: 11 }}>
              {getTagName(tid)}
            </Tag>
          ))}
          {(tids ?? []).length > 2 && <Tag>+{tids.length - 2}</Tag>}
        </>
      ),
    },
    {
      title: 'Lượt xem', dataIndex: 'views', key: 'views', width: 100, align: 'right',
      render: (v: number) => <Text><EyeOutlined /> {v}</Text>,
    },
    {
      title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: 120,
      render: (d: string) => <Text type="secondary">{d}</Text>,
    },
    {
      title: 'Hành động', key: 'action', width: 110, align: 'center',
      render: (_: unknown, record: Post) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm title="Xóa bài viết này?" okText="Xóa" cancelText="Hủy" onConfirm={() => handleDelete(record.id)}>
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
  maxWidth: 1200, 
  margin: '0 auto', 
  padding: '28px 20px' 
}}>

  {/* HEADER */}
  <Card 
    style={{ 
      marginBottom: 18, 
      borderRadius: 16,
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
    }} 
    bodyStyle={{ padding: '22px 24px' }}
  >
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      flexWrap: 'wrap', 
      gap: 12, 
      marginBottom: 16 
    }}>
      
      <Title level={4} style={{ margin: 0 }}>
        <FileTextOutlined style={{ marginRight: 8, color: '#6366f1' }} />
        Quản lý bài viết
      </Title>

      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={openCreate}
        style={{
          borderRadius: 10,
          background: '#6366f1',
          border: 'none',
          fontWeight: 500
        }}
      >
        Thêm bài viết
      </Button>
    </div>

    <Space wrap>
      <Input
        placeholder="Tìm kiếm theo tiêu đề..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ 
          width: 280,
          borderRadius: 10
        }}
        allowClear
        prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
      />

      <Select 
        value={statusFilter} 
        onChange={(v: string) => setStatusFilter(v)} 
        style={{ width: 180 }}
      >
        <Option value="all">Tất cả trạng thái</Option>
        <Option value="published">Đã đăng</Option>
        <Option value="draft">Nháp</Option>
      </Select>

      <Text type="secondary" style={{ fontSize: 13 }}>
        Tổng: {filtered.length} bài
      </Text>
    </Space>
  </Card>

  {/* TABLE */}
  <Card 
    style={{ 
      borderRadius: 16,
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
    }}
  >
    <Table<Post>
      dataSource={filtered}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10, showSizeChanger: false }}
      locale={{ emptyText: <Empty description="Không có bài viết nào" /> }}
      scroll={{ x: 700 }}
      size="middle"
      style={{
        borderRadius: 12,
        overflow: 'hidden'
      }}
    />
  </Card>

  {/* MODAL */}
  <Modal
    title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
    visible={modalVisible}
    onCancel={() => setModalVisible(false)}
    onOk={() => { void handleSubmit(); }}
    okText={editingPost ? 'Cập nhật' : 'Thêm'}
    cancelText="Hủy"
    width={720}
    destroyOnClose
    bodyStyle={{ paddingTop: 10 }}
  >
    <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
      
      <Row gutter={16}>
        <Col span={16}>
          <Form.Item 
            name="title" 
            label="Tiêu đề" 
            rules={[{ required: true, message: 'Nhập tiêu đề' }]}
          >
            <Input 
              placeholder="Tiêu đề bài viết..." 
              style={{ borderRadius: 10 }}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item 
            name="slug" 
            label="Slug" 
            rules={[{ required: true, message: 'Nhập slug' }]}
          >
            <Input 
              placeholder="ten-bai-viet" 
              style={{ borderRadius: 10 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="coverImage" label="Ảnh đại diện (URL)">
        <Input 
          placeholder="https://..." 
          style={{ borderRadius: 10 }}
        />
      </Form.Item>

      <Form.Item 
        name="content" 
        label="Nội dung (Markdown)" 
        rules={[{ required: true, message: 'Nhập nội dung' }]}
      >
        <TextArea 
          rows={8} 
          placeholder="Viết nội dung bài viết bằng Markdown..." 
          style={{ 
            fontFamily: 'monospace', 
            fontSize: 13,
            borderRadius: 10
          }} 
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={16}>
          <Form.Item name="tags" label="Thẻ">
            <Select 
              mode="multiple" 
              placeholder="Chọn thẻ..." 
              optionFilterProp="children"
              style={{ borderRadius: 10 }}
            >
              {tags.map(t => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item 
            name="status" 
            label="Trạng thái" 
            rules={[{ required: true, message: 'Chọn trạng thái' }]}
          >
            <Select style={{ borderRadius: 10 }}>
              <Option value="published">Đăng ngay</Option>
              <Option value="draft">Lưu nháp</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

    </Form>
  </Modal>

</div>
  );
}

// ─── MANAGE TAGS PAGE ─────────────────────────────────────────────────────────

interface ManageTagsPageProps {
  tags: TagItem[];
  setTags: React.Dispatch<React.SetStateAction<TagItem[]>>;
  posts: Post[];
}

function ManageTagsPage({ tags, setTags, posts }: ManageTagsPageProps): React.ReactElement {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [form] = Form.useForm();

  const getPostCount = (tagId: string): number => posts.filter(p => p.tags.includes(tagId)).length;

  const openCreate = (): void => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (tag: TagItem): void => {
    setEditingTag(tag);
    form.setFieldsValue({ name: tag.name });
    setModalVisible(true);
  };

  const handleDelete = (id: string): void => {
    const count = getPostCount(id);
    if (count > 0) {
      void message.warning(`Thẻ này đang được dùng bởi ${count} bài viết`);
      return;
    }
    setTags(prev => prev.filter(t => t.id !== id));
    void message.success('Đã xóa thẻ');
  };

  const handleSubmit = async (): Promise<void> => {
    const values = await form.validateFields() as { name: string };
    if (editingTag) {
      setTags(prev => prev.map(t => t.id === editingTag.id ? { ...t, name: values.name } : t));
      void message.success('Đã cập nhật thẻ');
    } else {
      setTags(prev => [...prev, { id: `t${Date.now()}`, name: values.name }]);
      void message.success('Đã thêm thẻ mới');
    }
    setModalVisible(false);
  };

  const columns: ColumnsType<TagItem> = [
    {
      title: 'Tên thẻ', dataIndex: 'name', key: 'name',
      render: (name: string) => (
        <Tag color={getTagColor(name)} style={{ borderRadius: 20, padding: '2px 12px', fontSize: 13 }}>
          {name}
        </Tag>
      ),
    },
    {
      title: 'Số bài viết', key: 'count', width: 150, align: 'center',
      render: (_: unknown, record: TagItem) => {
        const count = getPostCount(record.id);
        return <Badge count={count} showZero style={{ backgroundColor: count > 0 ? '#ff4d4f' : '#d9d9d9' }} />;
      },
    },
    {
      title: 'Hành động', key: 'action', width: 120, align: 'center',
      render: (_: unknown, record: TagItem) => (
        <Space>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title={`Xóa thẻ "${record.name}"?`}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const statCards: { label: string; value: number; color: string }[] = [
    { label: 'Tổng thẻ', value: tags.length, color: '#ff4d4f' },
    { label: 'Đang sử dụng', value: tags.filter(t => getPostCount(t.id) > 0).length, color: '#52c41a' },
    { label: 'Chưa dùng', value: tags.filter(t => getPostCount(t.id) === 0).length, color: '#faad14' },
  ];

  return (
    <div style={{ 
  maxWidth: 1200, 
  margin: '0 auto', 
  padding: '28px 20px' 
}}>

  {/* HEADER */}
  <Card 
    style={{ 
      marginBottom: 18, 
      borderRadius: 16,
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
    }} 
    bodyStyle={{ padding: '22px 24px' }}
  >
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      
      <Title level={4} style={{ margin: 0 }}>
        <TagsOutlined style={{ marginRight: 8, color: '#6366f1' }} />
        Quản lý thẻ
      </Title>

      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={openCreate}
        style={{
          borderRadius: 10,
          background: '#6366f1',
          border: 'none',
          fontWeight: 500
        }}
      >
        Thêm thẻ
      </Button>
    </div>
  </Card>

  {/* STATS */}
  <Row gutter={[16, 16]} style={{ marginBottom: 18 }}>
    {statCards.map(s => (
      <Col key={s.label} xs={8}>
        <Card 
          style={{ 
            borderRadius: 16, 
            textAlign: 'center',
            boxShadow: '0 6px 18px rgba(0,0,0,0.05)'
          }} 
          bodyStyle={{ padding: '18px 12px' }}
        >
          <Statistic 
            title={s.label} 
            value={s.value} 
            valueStyle={{ 
              color: '#4f46e5', 
              fontWeight: 700,
              fontSize: 20
            }} 
          />
        </Card>
      </Col>
    ))}
  </Row>

  {/* TABLE */}
  <Card 
    style={{ 
      borderRadius: 16,
      boxShadow: '0 6px 20px rgba(0,0,0,0.06)'
    }}
  >
    <Table<TagItem>
      dataSource={tags}
      columns={columns}
      rowKey="id"
      pagination={false}
      locale={{ emptyText: <Empty description="Chưa có thẻ nào" /> }}
      size="middle"
      style={{
        borderRadius: 12,
        overflow: 'hidden'
      }}
    />
  </Card>

  {/* MODAL */}
  <Modal
    title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
    visible={modalVisible}
    onCancel={() => setModalVisible(false)}
    onOk={() => { void handleSubmit(); }}
    okText={editingTag ? 'Cập nhật' : 'Thêm'}
    cancelText="Hủy"
    width={420}
    destroyOnClose
    bodyStyle={{ paddingTop: 10 }}
  >
    <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
      
      <Form.Item
        name="name"
        label="Tên thẻ"
        rules={[
          { required: true, message: 'Nhập tên thẻ' },
          { min: 2, message: 'Tên thẻ ít nhất 2 ký tự' },
        ]}
      >
        <Input 
          placeholder="Ví dụ: React, TypeScript..." 
          size="large"
          style={{ borderRadius: 10 }}
        />
      </Form.Item>

    </Form>
  </Modal>

</div>
  );
}