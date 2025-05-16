"use client";
import { useSearchParams } from 'next/navigation';
import ViewTimesheet from "../../../components/ViewTimesheet";

const ViewTimesheetPage = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const viewedTimesheet = data ? JSON.parse(decodeURIComponent(data)) : null;

  if (!viewedTimesheet) return null;

  return (
    <ViewTimesheet viewedTimesheet={viewedTimesheet} />
  );
};

export default ViewTimesheetPage;