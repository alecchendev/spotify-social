import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Button, Heading, TextInput, Text } from '../components';
import styles from '../styles/home.module.css';
import utilStyles from '../styles/utils.module.css';

// const url = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000';
const url = process.env.NODE_ENV === 'production' ? 'https://morning-oasis-60015.herokuapp.com' : 'http://localhost:5000';
const API_VERSION = 'v1'; // TEMPORARY FIX LATER

export default function Home() {

	const [ search, setSearch ] = React.useState('');

	const handleChange = (event) => {
		setSearch(event.target.value);
	}

  const router = useRouter();
  const { deleted } = router.query;
	// const { deleted } = getQueryParams(window);

	return (
    <Layout>
		<div className={styles.wrapper}>
			<Heading>Spotify Social</Heading>
			<Text className={styles.subtitle}>Search a friend's Spotify username to view their profile or login to activate your own.</Text>
			<div className={styles.searchBox}>
				<TextInput type='text' placeholder='Username' onChange={handleChange} />
				<div className={styles.vertAlign}>
					<Link href={'/' + search}><Button className={utilStyles.btnGreen}>Search</Button></Link>
				</div>
				<div className={styles.vertAlign}>
					<a href={url + '/' + API_VERSION + '/login'}><Button className={utilStyles.btnGreen}>Login</Button></a>
				</div>
			</div>
			<div className={styles.content}>
				{
					deleted
					&&
					<div>
						<Text>{'Deleted user: ' + deleted}</Text>
					</div>
				}
			</div>
		</div>
    </Layout>
	)
}




// export default function Home() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Create Next App</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to <a href="https://nextjs.org">Next.js!</a>
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{' '}
//           <code className={styles.code}>pages/index.js</code>
//         </p>

//         <div className={styles.grid}>
//           <a href="https://nextjs.org/docs" className={styles.card}>
//             <h3>Documentation &rarr;</h3>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a href="https://nextjs.org/learn" className={styles.card}>
//             <h3>Learn &rarr;</h3>
//             <p>Learn about Next.js in an interactive course with quizzes!</p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/master/examples"
//             className={styles.card}
//           >
//             <h3>Examples &rarr;</h3>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//           >
//             <h3>Deploy &rarr;</h3>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
//         </a>
//       </footer>
//     </div>
//   )
// }
