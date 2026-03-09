import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calculations = await repo
      .createQueryBuilder('calc')
      .leftJoin('calc.likes', 'like')
      .leftJoin('calc.comments', 'comment')
      .select([
        'calc.id',
        'calc.expression',
        'calc.result',
        'calc.username',
        'calc.createdAt',
      ])
      .addSelect('COUNT(DISTINCT like.id)', 'likeCount')
      .addSelect('COUNT(DISTINCT comment.id)', 'commentCount')
      .groupBy('calc.id')
      .orderBy('calc.createdAt', 'DESC')
      .getRawMany();

    const formatted = calculations.map((c) => ({
      id: c.calc_id,
      expression: c.calc_expression,
      result: c.calc_result,
      username: c.calc_username,
      createdAt: c.calc_createdAt,
      likeCount: Number(c.likeCount),
      commentCount: Number(c.commentCount),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { expression, result, username } = body;

    if (!expression || !result) {
      return NextResponse.json(
        { error: 'Expression and result are required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calculation = repo.create({
      expression,
      result,
      username: username || 'Anonymous',
    });

    const saved = await repo.save(calculation);

    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}
