import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
  path: '/Bai2b',
  name: 'Bai2b',
  icon: 'OrderedListOutlined',
  component: './Bai2b',
},
{
  path: '/Bai2a',
  name: 'Bai2a',
  icon: 'OrderedListOutlined',
  component: './Bai2a',
},
{
	path : '/Bai1',
	name : 'Bai1',
	icon : 'OrderedListOutlined',
	component : './Bai1',
},
{
	path: '/TH1_Bai1',
	name: 'TH1_Bai1',
	icon: 'OrderedListOutlined',
	component: './TH1_Bai1',
},
{
	path: '/TH1_Bai2',
	name: 'TH1_Bai2',
	icon: 'OrderedListOutlined',
	component: './TH1_Bai2',
}
,
{
	path: '/TH2_Bai1',
	name: 'TH2_Bai1',
	icon: 'OrderedListOutlined',
	component: './TH2_Bai1',
},
{
	path: '/TH2_Bai2',
	name: 'TH2_Bai2',
	icon: 'OrderedListOutlined',
	component: './TH2_Bai2',
},
{
	path: '/TH3',
	name: 'TH3',
	icon: 'OrderedListOutlined',
	component: './TH3',
},
{
	path: '/TH4',
	name: 'TH4',
	icon: 'OrderedListOutlined',
	component: './TH4',
},
{
	path: '/TH5',
	name: 'TH5',
	icon: 'OrderedListOutlined',
	component: './TH5',
},
{
		path: '/TH06/user',
		name: 'user',
		icon: 'OrderedListOutlined',
		component: './TH06/user',
	},

	{
		path: '/TH06/admin',
		name: 'admin',
		icon: 'OrderedListOutlined',
		component: './TH06/admin',
	},
	{
		path: '/KTGK',
		name: 'KTGK',
		icon: 'OrderedListOutlined',
		component: './KTGK',
	},
	{
		path: '/TH07',
		name: 'TH7',
		icon: 'OrderedListOutlined',
		component: './TH07',
	},
	{
		path: '/TH08',	
		name: 'TH8',
		icon: 'OrderedListOutlined',
		component: './TH08',
	},
	{
		path: '/TH09',
		name: 'TH9',
		icon: 'OrderedListOutlined',
		component: './TH09',	
	},
	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];