export const STATUS_MAP: Record<string, boolean | undefined> = {
  all: undefined,
  active: true,
  inactive: false,
};

export const STATUS_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Hoạt động", value: "active" },
  { label: "Không hoạt động", value: "inactive" },
];

export const STATUS_OPTIONS_MODAL = [
  { label: "Hoạt động", value: "active" },
  { label: "Không hoạt động", value: "inactive" },
];

export const STUDENT_STATUS = {
  STUDYING: 1,
  INACTIVE: 2,
} as const;

export const STUDENT_STATUS_OPTIONS = [
  { value: String(STUDENT_STATUS.STUDYING), label: "Đang học" },
  { value: String(STUDENT_STATUS.INACTIVE), label: "Đã nghỉ học" },
] as const;

export const TEACHER_STATUS = {
  WORKING: 1,
  RESIGNED: 2,
} as const;

export const TEACHER_STATUS_OPTIONS = [
  { value: String(TEACHER_STATUS.WORKING), label: "Đang làm việc" },
  { value: String(TEACHER_STATUS.RESIGNED), label: "Đã nghỉ việc" },
] as const;
