'use client';

import { useState } from 'react';
import { User, Role } from '@/types/auth';
import * as Dialog from '@radix-ui/react-dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, CheckCircle, X, Pencil, Trash2 } from 'lucide-react';

interface UsersTabProps {
    usersList: User[];
    usersLoading: boolean;
    currentUserId: string | undefined;
    showError: (message: string) => void;
    showSuccess: (message: string, title?: string) => void;
    showConfirm: (message: string, onConfirm: () => void) => void;
    onAddUser: (data: {
        name: string;
        email: string;
        role: Role;
        nim_nip: string;
    }) => Promise<void>;
    onUpdateUser: (
        id: string,
        data: {
            name: string;
            email: string;
            role: Role;
            nim_nip: string;
            password?: string;
        },
    ) => Promise<void>;
    onDeleteUser: (id: string) => Promise<void>;
}

export function UsersTab({
    usersList,
    usersLoading,
    currentUserId,
    showError,
    showSuccess,
    showConfirm,
    onAddUser,
    onUpdateUser,
    onDeleteUser,
}: UsersTabProps) {
    const [userSearch, setUserSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

    // Add user form
    const [uName, setUName] = useState('');
    const [uEmail, setUEmail] = useState('');
    const [uRole, setURole] = useState<Role>('mahasiswa');
    const [uNimNip, setUNimNip] = useState('');
    const [userSuccessMessage, setUserSuccessMessage] = useState('');

    // Edit user
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState<Role>('mahasiswa');
    const [editNimNip, setEditNimNip] = useState('');
    const [editPassword, setEditPassword] = useState('');

    const filteredUsers = usersList.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uName || !uEmail || !uNimNip) return;

        const emailExists = usersList.some(
            (u) => u.email.toLowerCase() === uEmail.toLowerCase(),
        );
        if (emailExists) {
            showError(`Email ${uEmail} sudah terdaftar.`);
            return;
        }

        const nimExists = usersList.some(
            (u) => u.nim_nip?.toLowerCase() === uNimNip.toLowerCase(),
        );
        if (nimExists) {
            showError(`NIM/NIP ${uNimNip} sudah terdaftar.`);
            return;
        }

        await onAddUser({
            name: uName,
            email: uEmail,
            role: uRole,
            nim_nip: uNimNip,
        });

        setUName('');
        setUEmail('');
        setUNimNip('');
        setUserSuccessMessage(`Registrasi akun untuk ${uName} berhasil!`);
        setTimeout(() => setUserSuccessMessage(''), 3000);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
        setEditRole(user.role);
        setEditNimNip(user.nim_nip || '');
        setEditPassword('');
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser || !editName || !editEmail || !editNimNip) return;

        await onUpdateUser(editingUser.id, {
            name: editName,
            email: editEmail,
            role: editRole,
            nim_nip: editNimNip,
            password: editPassword || undefined,
        });

        setEditingUser(null);
        setUserSuccessMessage(`Data ${editName} berhasil diperbarui!`);
        setTimeout(() => setUserSuccessMessage(''), 3000);
    };

    const confirmDelete = (id: string) => {
        showConfirm(
            'Apakah Anda yakin ingin menghapus akun pengguna ini?',
            () => onDeleteUser(id),
        );
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* User Table */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="text-[15px] font-bold text-ink">
                        Seluruh Pengguna Sistem
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5 w-48">
                            <Search size={14} className="text-muted shrink-0" />
                            <input
                                type="text"
                                placeholder="Cari user..."
                                className="bg-transparent border-0 outline-none text-[12px] text-ink placeholder:text-muted w-full"
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) =>
                                setRoleFilter(e.target.value as Role | 'all')
                            }
                            className="h-9 border border-border rounded-lg px-2 text-[12px] bg-white outline-none"
                        >
                            <option value="all">Semua Peran</option>
                            <option value="mahasiswa">Mahasiswa</option>
                            <option value="dosen">Dosen</option>
                            <option value="tu">Tata Usaha</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[12px] border-collapse">
                            <thead>
                                <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                                    <th className="p-3">Nama Lengkap</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">NIM / NIP</th>
                                    <th className="p-3 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {usersLoading ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-6 text-center text-[13px] text-muted"
                                        >
                                            Memuat data pengguna...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-6 text-center text-[13px] text-muted"
                                        >
                                            Belum ada pengguna terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="hover:bg-surface2/30"
                                        >
                                            <td className="p-3 font-bold text-ink">
                                                {u.name}
                                            </td>
                                            <td className="p-3 text-ink2">
                                                {u.email}
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={
                                                        u.role === 'admin'
                                                            ? 'red'
                                                            : u.role === 'dosen'
                                                              ? 'blue'
                                                              : u.role === 'tu'
                                                                ? 'purple'
                                                                : 'gray'
                                                    }
                                                >
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td className="p-3 font-mono text-muted">
                                                {u.nim_nip || '-'}
                                            </td>
                                            <td className="p-3 text-left">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(u)
                                                        }
                                                        className="size-8 flex items-center justify-center rounded-lg text-iris-600 hover:bg-iris-50 cursor-pointer transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    {u.id !== currentUserId ? (
                                                        <button
                                                            onClick={() =>
                                                                confirmDelete(
                                                                    u.id,
                                                                )
                                                            }
                                                            className="size-8 flex items-center justify-center rounded-lg text-danger hover:bg-red-50 cursor-pointer transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] text-muted italic">
                                                            Self
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Edit User Modal */}
            <Dialog.Root
                open={!!editingUser}
                onOpenChange={(open) => {
                    if (!open) setEditingUser(null);
                }}
            >
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                            <Dialog.Title className="text-[15px] font-bold text-ink">
                                Edit Pengguna
                            </Dialog.Title>
                            <Dialog.Close asChild>
                                <button className="size-7 flex items-center justify-center rounded-full text-muted hover:bg-surface2 cursor-pointer transition-colors">
                                    <X size={16} />
                                </button>
                            </Dialog.Close>
                        </div>

                        <form onSubmit={handleEditUser} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-name">Nama Lengkap</Label>
                                <Input
                                    id="edit-name"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) =>
                                        setEditEmail(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-role">
                                        Peran (Role)
                                    </Label>
                                    <select
                                        id="edit-role"
                                        value={editRole}
                                        onChange={(e) =>
                                            setEditRole(e.target.value as Role)
                                        }
                                        className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                                    >
                                        <option value="mahasiswa">
                                            Mahasiswa
                                        </option>
                                        <option value="dosen">Dosen</option>
                                        <option value="tu">Tata Usaha</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="edit-nim">NIM / NIP</Label>
                                    <Input
                                        id="edit-nim"
                                        value={editNimNip}
                                        onChange={(e) =>
                                            setEditNimNip(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-password">
                                    Password Baru
                                    <span className="text-[11px] text-muted ml-1">
                                        (biarkan kosong jika tidak diubah)
                                    </span>
                                </Label>
                                <Input
                                    id="edit-password"
                                    type="password"
                                    placeholder="Kosongkan jika tidak diubah"
                                    value={editPassword}
                                    onChange={(e) =>
                                        setEditPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <Dialog.Close asChild>
                                    <button
                                        type="button"
                                        className="flex-1 h-9 rounded-lg text-[13px] font-semibold border border-border text-ink hover:bg-surface2 cursor-pointer transition-colors"
                                    >
                                        Batal
                                    </button>
                                </Dialog.Close>
                                <button
                                    type="submit"
                                    className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-iris-500 text-white hover:bg-iris-600 cursor-pointer transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Add User Form */}
            <Card className="p-5 h-fit space-y-4">
                <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border">
                    Daftarkan Pengguna Baru
                </h3>

                {userSuccessMessage && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-[12px] flex items-center gap-2">
                        <CheckCircle size={16} className="text-success" />{' '}
                        {userSuccessMessage}
                    </div>
                )}

                <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="u-name">Nama Lengkap</Label>
                        <Input
                            id="u-name"
                            placeholder="Contoh: Prof. Dr. Ir. Gunawan"
                            value={uName}
                            onChange={(e) => setUName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="u-email">Email Utama</Label>
                        <Input
                            id="u-email"
                            type="email"
                            placeholder="gunawan@dsn.dinus.ac.id"
                            value={uEmail}
                            onChange={(e) => setUEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="u-role">Peran (Role)</Label>
                            <select
                                id="u-role"
                                value={uRole}
                                onChange={(e) =>
                                    setURole(e.target.value as Role)
                                }
                                className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                            >
                                <option value="mahasiswa">Mahasiswa</option>
                                <option value="dosen">Dosen</option>
                                <option value="tu">Tata Usaha</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="u-nim">NIM / NIP</Label>
                            <Input
                                id="u-nim"
                                placeholder="198001012010..."
                                value={uNimNip}
                                onChange={(e) => setUNimNip(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full gap-2 cursor-pointer"
                    >
                        <Plus size={15} /> Daftarkan Akun
                    </Button>
                </form>
            </Card>
        </div>
    );
}
