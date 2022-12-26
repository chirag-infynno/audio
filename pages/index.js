import Head from "next/head";
import styles from "../styles/Home.module.css";
import { AudioPlayer } from "../components/AudioPlayer";

export default function Home() {
  return (
    <div className=" max-w-[1440px] mx-auto">
      <Head>
        <title>React Audio Player</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col pt-16">
        <AudioPlayer />
      </main>
    </div>
  );
}
