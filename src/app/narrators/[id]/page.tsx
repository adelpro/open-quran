import { notFound } from 'next/navigation';
import React from 'react';
type Props = {
  params: {
    id: string | undefined;
  };
};
export default function page({ params }: Props) {
  const { id } = params;
  if (!id) {
    return notFound();
  }
  return <div>Narrator id: {id}</div>;
}
