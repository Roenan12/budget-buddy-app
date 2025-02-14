import Spinner from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="grid item-center justify-center">
      <Spinner />
      <p className="text-xl text-primary-200">Loading expenses data...</p>
    </div>
  );
}
