import Image from "next/image";

interface Props {
  src?: string;
}

const SelectedImageThumb = ({ src }: Props) => {
  if (!src) return null;

  return (
    <div className="w-20 h-20 relative">
      <Image
        src={src}
        alt="product"
        fill
        // sizes="undefined"
        sizes="(max-width: 640px) 100vw, 50vw" // Example sizes value
        priority
        className="object-fill rounded bg-blue-gray-200"
      />
    </div>
  );
};

export default SelectedImageThumb;