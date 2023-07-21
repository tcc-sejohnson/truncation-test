import { NextResponse, type NextRequest } from 'next/server';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function nonsense(length: number) {
    let result = '';
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
      counter += 1;
    }
    return result;
}

export function GET(request: NextRequest) {
  const dataLength = request.nextUrl.searchParams.get('dataLength');
  if (!dataLength) throw new Error("Provide the query parameter, dummy");
  return NextResponse.json({
    data: nonsense(Number(dataLength))
  })
}