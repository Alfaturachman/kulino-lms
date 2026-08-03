'use client';

import dynamic from 'next/dynamic';
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData';

const OverviewTab = dynamic(
    () => import('@/components/admin/OverviewTab').then((m) => m.OverviewTab),
    { ssr: false },
);
const UsersTab = dynamic(
    () => import('@/components/admin/UsersTab').then((m) => m.UsersTab),
    { ssr: false },
);
const CoursesTab = dynamic(
    () => import('@/components/admin/CoursesTab').then((m) => m.CoursesTab),
    { ssr: false },
);
const CalendarTab = dynamic(
    () => import('@/components/admin/CalendarTab').then((m) => m.CalendarTab),
    { ssr: false },
);
const ReportsTab = dynamic(
    () => import('@/components/admin/ReportsTab').then((m) => m.ReportsTab),
    { ssr: false },
);
const SettingsTab = dynamic(
    () => import('@/components/admin/SettingsTab').then((m) => m.SettingsTab),
    { ssr: false },
);

interface AdminDashboardClientProps {
    initialTab: string;
}

export default function AdminDashboardClient({
    initialTab,
}: AdminDashboardClientProps) {
    const {
        adminName,
        user,
        AlertDialog,
        ConfirmDialog,
        showError,
        showSuccess,
        showConfirm,

        usersList,
        usersLoading,
        handleAddUser,
        handleUpdateUser,
        handleDeleteUser,

        coursesList,
        coursesPage,
        coursesPageSize,
        coursesSearchQuery,
        coursesTotalCount,
        coursesLoading,
        studentsLoading,
        enrollmentStudents,
        enrollments,
        setCoursesPage,
        setCoursesSearchQuery,
        setStudentsSearchQuery,
        handleAddCourse,
        handleDeleteCourse,
        handleEnrollStudent,
        handleUnenrollStudent,

        eventsList,
        handleAddEvent,
        handleDeleteEvent,

        maintenanceMode,
        studentRegistration,
        ldapSync,
        setMaintenanceMode,
        setStudentRegistration,
        setLdapSync,

        auditLogs,
        auditLoading,
        handleExportReport,

        totalUsersCount,
        mahasiswaCount,
        dosenCount,
        staffCount,
    } = useAdminDashboardData();

    return (
        <div className="space-y-6">
            {AlertDialog}
            {ConfirmDialog}

            {initialTab === 'overview' && (
                <OverviewTab
                    adminName={adminName}
                    totalUsersCount={totalUsersCount}
                    mahasiswaCount={mahasiswaCount}
                    dosenCount={dosenCount}
                    staffCount={staffCount}
                    studentRegistration={studentRegistration}
                    auditLogs={auditLogs}
                    auditLoading={auditLoading}
                />
            )}

            {initialTab === 'courses' && (
                <CoursesTab
                    courses={coursesList}
                    students={enrollmentStudents}
                    enrollments={enrollments}
                    onAddCourse={handleAddCourse}
                    onDeleteCourse={handleDeleteCourse}
                    onEnrollStudent={handleEnrollStudent}
                    onUnenrollStudent={handleUnenrollStudent}
                    showSuccess={showSuccess}
                    showConfirm={showConfirm}
                    coursesTotalCount={coursesTotalCount}
                    coursesCurrentPage={coursesPage}
                    coursesPageSize={coursesPageSize}
                    onCoursesPageChange={setCoursesPage}
                    coursesLoading={coursesLoading}
                    initialCourseSearch={coursesSearchQuery}
                    onCourseSearchChange={setCoursesSearchQuery}
                    studentsLoading={studentsLoading}
                    onStudentSearchChange={setStudentsSearchQuery}
                />
            )}

            {initialTab === 'users' && (
                <UsersTab
                    usersList={usersList}
                    usersLoading={usersLoading}
                    currentUserId={user?.id}
                    showError={showError}
                    showSuccess={showSuccess}
                    showConfirm={showConfirm}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                />
            )}

            {initialTab === 'calendar' && (
                <CalendarTab
                    eventsList={eventsList}
                    onAddEvent={handleAddEvent}
                    onDeleteEvent={handleDeleteEvent}
                />
            )}

            {initialTab === 'reports' && (
                <ReportsTab onExport={handleExportReport} />
            )}

            {initialTab === 'settings' && (
                <SettingsTab
                    maintenanceMode={maintenanceMode}
                    studentRegistration={studentRegistration}
                    ldapSync={ldapSync}
                    onChangeMaintenance={setMaintenanceMode}
                    onChangeRegistration={setStudentRegistration}
                    onChangeLdap={setLdapSync}
                />
            )}
        </div>
    );
}
