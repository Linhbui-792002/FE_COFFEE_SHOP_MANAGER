import { useState } from 'react'
import Image from 'next/image'
import DefaultImage from '~public/images/no-image.png'

const CustomImage = ({ src, alt, className, onClick, onLoad, style, width, height, sizes, quality }) => {
  const [imageSrc, setImageSrc] = useState(src || DefaultImage.src)

  const handleImageError = () => {
    setImageSrc(DefaultImage.src)
  }

  const handleLoad = () => {
    if (onLoad) {
      onLoad()
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <Image
      alt={alt || 'Image'}
      className={className}
      data-sizes="auto"
      height={height}
      onClick={handleClick}
      onError={handleImageError}
      onLoad={handleLoad}
      quality={quality}
      sizes={sizes}
      src={imageSrc}
      style={style}
      width={width}
    />
  )
}

export default CustomImage
