import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Like } from '@/entities/Like';
import { Calculation } from '@/entities/Calculation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { calculationId, username } = body;

    if (!calculationId) {
      return NextResponse.json(
        { error: 'calculationId is required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const likeRepo = ds.getRepository(Like);
    const calcRepo = ds.getRepository(Calculation);

    const calculation = await calcRepo.findOne({ where: { id: calculationId } });
    if (!calculation) {
      return NextResponse.json(
        { error: 'Calculation not found' },
        { status: 404 }
      );
    }

    const user = username || 'Anonymous';
    const existingLike = await likeRepo.findOne({
      where: { calculationId, username: user },
    });

    if (existingLike) {
      await likeRepo.remove(existingLike);
      return NextResponse.json({ liked: false, message: 'Like removed' });
    } else {
      const like = likeRepo.create({ calculationId, username: user });
      await likeRepo.save(like);
      return NextResponse.json({ liked: true, message: 'Like added' }, { status: 201 });
    }
  } catch (error) {
    console.error('POST /api/likes error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
