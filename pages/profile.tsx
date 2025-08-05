import Head from 'next/head';
import Header from '../components/Header';
import ContinueWatchingRow from '../components/ContinueWatchingRow';
import useAuth from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Head>
        <title>Profile - Netflix clone</title>
      </Head>
      <Header />
      <div className="pt-24 p-4 space-y-6">
        <h1 className="text-3xl font-semibold">Profile</h1>
        {user && (
          <div>
            <p className="font-medium">{user.email}</p>
          </div>
        )}
        <ContinueWatchingRow />
      </div>
    </div>
  );
}

