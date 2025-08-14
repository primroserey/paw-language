# command for paww

```*📦 Variabel*

Deklarasi variabel

lepas foo = "halo dunia"
// let foo = "halo dunia"

deklar foo = 123
// const foo = 123

Reassign variabel

foo = "halo dunia 2"
// foo = "halo dunia 2"

Boolean

lepas foo = benar
// let foo = true

lepas foo = salah
// let foo = false
```

---

```*🖨 print*

tulis("Halo dunia")
// console.log("Halo dunia")

tulis(foo)
// console.log(foo)
```

---

```*🔀 Kondisi*

jika (foo == "halo dunia") {
  tulis("ini halo dunia")
}
// if (foo == "halo dunia") { console.log("ini halo dunia") }

jika (foo > 3) {
  tulis("lebih besar dari 3")
} maka jika (foo == 3) {
  tulis("foo adalah 3")
} maka {
  tulis("lebih kecil dari 3")
}
// if (foo > 3) { ... } else if (foo == 3) { ... } else { ... }

Operator perbandingan Paw:

== → sama dengan

!= → tidak sama

> → lebih besar

< → lebih kecil

>= → lebih besar sama dengan

<= → lebih kecil sama dengan
```

---

```*🔁 Loop*

For loop

ulang(i = 0; i < 10; i++) {
  jika (i > 3) {
    tulis("loop ke " + i)
  }
}

For of loop

untuk (item dari daftar) {
  tulis(item)
}

Break & Continue

selesai
// break

lanjut
// continue
```

---

```*⚙️ Fungsi*

fungsi ceritaSaya() {
  lepas umur = 21
  tulis("Umur lu " + umur)
}

ceritaSaya()

Fungsi dengan parameter

fungsi banyakParam(a, b, c) {
  tulis("a: " + a)
  tulis("b: " + b)
  tulis("c: " + c)
}

banyakParam(3, 4, 5)
```

---

```*⏳ Fungsi Async*

fungsi async ceritaAsync() {
  lepas umur = 21
  tulis("Umur lu " + umur)
}

tunggu ceritaAsync()

```

---

```*🛡 Try Catch & Exception*

coba {
  tulis("Ada yang salah")
  lempar "Pesan error"
} tangkap {
  tulis("Menangkap error")
} akhirnya {
  tulis("Selesai")
}

Hasil JS:

try {
  console.log("Ada yang salah");
  throw "Pesan error";
} catch {
  console.log("Menangkap error");
} finally {
  console.log("Selesai");
}
```