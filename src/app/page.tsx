'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export default function Home() {
  const [sentLength, setSentLength] = useState(1000);
  const [receivedLength, setReceivedLength] = useState(1000);
  const [receivedData, setReceivedData] = useState('');
  const [failed, setFailed] = useState(false);

  const getSoMuchData = useCallback(async (howMuch: number, signal: AbortSignal): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSentLength(howMuch);
    const resp = await fetch(`/api?dataLength=${howMuch}`, { signal });
    const json = await resp.json() as { data: string };
    const rl = json.data.length;
    setReceivedLength(rl);
    setReceivedData(json.data);
    if (rl !== howMuch) {
      setFailed(true);
      return;
    }
    if (signal.aborted) {
      return;
    }
    getSoMuchData(howMuch * 2, signal)
  }, []);

  useEffect(() => {
    if (failed) return;
    const controller = new AbortController();
    getSoMuchData(sentLength, controller.signal);
    return () => controller.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSoMuchData])

  return (
    <main className="flex flex-col items-center justify-between w-screen min-h-screen p-24">
      <p>Sent length: {sentLength}</p>
      <p>Received length: {receivedLength}</p>
      <p>Failed: {failed ? 'true' : 'false'}</p>
      <details>
        <summary>Response content</summary>
        {receivedData}
      </details>
    </main>
  )
}
