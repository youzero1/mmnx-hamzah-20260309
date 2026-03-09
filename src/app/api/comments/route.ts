import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Comment } from '@/entities/Comment';
import { Calculation } from '@/entities/Calculation';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const calculationId = searchParams.get('calculationId');

    if (!calculationId) {
      return NextResponse.json(
        { error: 'calculationId is required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Comment);

    const comments = await repo.find({
      where: { calculationId: Number(calculationId) },
      order: { createdAt: 'ASC' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('GET /api/comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { calculationId, content, username } = body;

    if (!calculationId || !content) {
      return NextResponse.json(
        { error: 'calculationId and content are required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const commentRepo = ds.getRepository(Comment);
    const calcRepo = ds.getRepository(Calculation);

    const calculation = await calcRepo.findOne({ where: { id: calculationId } });
    if (!calculation) {
      return NextResponse.json(
        { error: 'Calculation not found' },
        { status: 404 }
      );
    }

    const comment = commentRepo.create({
      calculationId,
      content,
      username: username || 'Anonymous',
    });

    const saved = await commentRepo.save(comment);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/comments error:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}
