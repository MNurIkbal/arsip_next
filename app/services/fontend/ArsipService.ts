export const createArsip = async (payload: any) => {
  const formData = new FormData();
  let response = null;
  
  if (payload.id) {
    const id = formData.append("id", payload.id);
    formData.append("judul", payload.judul);
    formData.append("tanggal", payload.tanggal);

    response = await fetch(`/api/arsip/${payload.id}`, {
      method: "PUT",
      body: formData,
    });
  } else {
    formData.append("judul", payload.judul);
    formData.append("tanggal", payload.tanggal);
    formData.append("kategori", payload.kategori);

    if (payload.password_arsip) {
      formData.append("password_arsip", payload.password_arsip);
    }

    payload.attachments.forEach((item: any, index: number) => {
      formData.append(`attachments[${index}][nama_dokumen]`, item.nama_dokumen);
      if (item.file) {
        formData.append(`attachments[${index}][file]`, item.file);
      }
    });

    response = await fetch("/api/arsip", {
      method: "POST",
      body: formData,
    });
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Gagal menyimpan data");
  }

  return response.json();
};