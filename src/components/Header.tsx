'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Header() {
    const [userName, setUserName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserName = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from('profiles')
                .select('name')
                .eq('user_id', user.id)
                .single();
            if (data) setUserName(data.name);
        };
        fetchUserName();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="bg-white border-b shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link
                    href="/profile"
                    className="flex items-center gap-2 font-bold text-slate-800 hover:text-blue-600 transition-colors"
                >
                    <span className="text-xl">📚</span>
                    <span>English Book Review</span>
                </Link>

                <div className="flex items-center gap-4">
                    {userName && (
                        <span className="text-sm text-slate-600">
                            {userName} さん
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        ログアウト
                    </button>
                </div>
            </div>
        </header>
    );
}
