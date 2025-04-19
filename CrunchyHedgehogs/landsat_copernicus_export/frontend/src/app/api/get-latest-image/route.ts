import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5001/api/get_latest_image');
    const data = await response.json();

    if (response.status !== 200) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    return NextResponse.json({ latest_image: data.latest_image });
  } catch (error) {
    console.error("Error fetching latest image:", error);
    return NextResponse.json(
      { error: 'Failed to fetch latest image' },
      { status: 500 }
    );
  }
}