export const checkIsMobile = () => {
  const userAgent = navigator.userAgent;
  const isIpad = /iPad/i.test(userAgent);
  const isMobileDevice =
    /Mobile|Android|iPhone|iPod|Opera Mini|IEMobile|WPDesktop|BlackBerry|BB10|PlayBook|webOS|Windows Phone|Opera Mobi|Fennec/i.test(
      userAgent,
    );

  return (
    isMobileDevice || (isIpad && !/Macintosh/i.test(userAgent)) || navigator.maxTouchPoints > 0
  );
};
