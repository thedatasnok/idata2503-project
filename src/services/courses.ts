export interface UseCoursesParams {
  active?: boolean;
  enrolled?: boolean;
  limit?: number;
  searchString?: string;
}

/**
 * Hook to fetch courses from Supabase.
 */
export const useCourses = (params: UseCoursesParams) => {
  // TODO: Wire up Supabase to fetch courses
  const data = [
    {
      id: 'placeholder',
      courseCode: 'IDATA2503',
      name: 'Mobile applications',
    },
    {
      id: 'placeholder2',
      courseCode: 'IDATA2502',
      name: 'Cloud services administration',
    },
    {
      id: 'placeholder3',
      courseCode: 'INFT2503',
      name: 'C++ for programmers',
    },
    {
      id: 'placeholder4',
      courseCode: 'IDATA2505',
      name: 'Internship',
    },
  ];

  return { data };
};
