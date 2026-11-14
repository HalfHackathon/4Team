interface BannerProps {
  message: string
}

/** 호출 실패 등 화면 안에 표시하는 알림. 브라우저 시스템 알림(Notification API)은 쓰지 않는다. */
export default function Banner({ message }: BannerProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  )
}
