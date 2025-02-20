<script>
import api from '@/api/axios'
import Swal from 'sweetalert2'

export default {
  props: {
    tipe: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || 'This field is required.',
        image: (value) => {
          return (
            !value ||
            !value.length ||
            value[0].size < 2000000 ||
            'Gambar melebihi batas maksimum 2 mb!'
          )
        }
      },
      btnLoading: false,
      kategoris: [],
      itemsStatus: [
        { text: 'kosong', value: '0' },
        { text: 'tersedia', value: '1' }
      ],
      items: [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Banana' },
        { id: 3, name: 'Cherry' }
      ],
      itemsOpsi: [
        { text: 'opsional', value: 0 },
        { text: 'wajib', value: 1 }
      ],
      isLoading: true,
      customInput: {
        customeKategoriMenu: [
          {
            nama_kategori: '',
            opsi: '',
            max_pilih: '',
            new_kategori_id: ''
          }
        ],
        customMenu: [
          {
            nama_pilihan: '',
            stok_pilihan: '',
            harga_pilihan: '',
            status_pilihan: '',
            mark_id_kategori: ''
          }
        ]
      },
      FormData: {
        nama: null,
        kategoriMenu: null,
        deskripsi: null,
        harga: null,
        status: null,
        gambar: [],
        customeKategoriMenu: [],
        customMenu: []
      },
      dialogCustome: false,
      typeSaveCustome: null,
      imageUrl: ''
    }
  },
  computed: {
    formattedHargaNonArray: {
      get() {
        return this.formatRupiah(this.FormData.harga || '')
      },
      set(value) {
        this.FormData.harga = value ? value.replace(/\D/g, '') : ''
      }
    },
    formattedAmountHargaPilihan() {
      return this.customInput.customMenu.map((menu) => this.formatRupiah(menu.harga_pilihan || ''))
    }
  },
  methods: {
    createImage(file) {
      if (!(file instanceof Blob || file instanceof File)) {
        console.error('Parameter is not a Blob or File')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.imageUrl = e.target.result // Menyimpan URL gambar setelah file dibaca
      }
      reader.readAsDataURL(file) // Membaca file sebagai URL Data
    },
    onFileChange(event) {
      const file = event.target.files[0] // Mendapatkan file dari event input

      if (!file) {
        return // Jika tidak ada file yang dipilih
      }

      this.createImage(file) // Mengirim file untuk diproses
    },
    formatOnBlurNonArray() {
      this.FormData.harga = this.formatRupiah(this.FormData.harga || '')
    },
    updateHargaPilihan(index, value) {
      this.customInput.customMenu[index].harga_pilihan = value.replace(/\D/g, '')
      console.log(this.customInput.customMenu)
    },
    formatOnBlur(index) {
      this.customInput.customMenu[index].harga_pilihan = this.formatRupiah(
        this.customInput.customMenu[index].harga_pilihan
      )
    },
    formatRupiah(value) {
      if (!value) return ''
      if (typeof value === 'number') {
        value = value.toString()
      }
      let numberString = value.replace(/[^,\d]/g, '').toString(),
        split = numberString.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi)

      if (ribuan) {
        let separator = sisa ? '.' : ''
        rupiah += separator + ribuan.join('.')
      }

      return split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
    },
    addCustom() {
      this.customInput.customMenu.push({
        nama_pilihan: '',
        stok_pilihan: '',
        harga_pilihan: '',
        status_pilihan: '',
        mark_id_kategori: ''
      })
      console.log(this.customInput.customMenu)
      console.log(this.customInput.customeKategoriMenu)
    },
    removeCustom(index) {
      this.customInput.customMenu.splice(index, 1)
    },
    removePickCustomPilihan(index) {
      const { customMenu } = this.FormData
      customMenu.splice(index, 1)
    },
    removePickCustom(index) {
      const { customeKategoriMenu, customMenu } = this.FormData

      const new_kategori_id = customeKategoriMenu[index].new_kategori_id

      for (let i = customMenu.length - 1; i >= 0; i--) {
        if (customMenu[i].mark_id_kategori == new_kategori_id) {
          customMenu.splice(i, 1)
        }
      }

      customeKategoriMenu.splice(index, 1)
    },
    setEmpty() {
      this.customInput = {
        customeKategoriMenu: [
          {
            nama_kategori: '',
            opsi: '',
            max_pilih: '',
            new_kategori_id: ''
          }
        ],
        customMenu: [
          {
            nama_pilihan: '',
            stok_pilihan: '',
            harga_pilihan: '',
            status_pilihan: '',
            mark_id_kategori: ''
          }
        ]
      }
      this.typeSaveCustome = null
      this.dialogCustome = false
    },
    updateCustom(index) {
      const { customeKategoriMenu, customMenu } = this.FormData
      this.customInput.customMenu = []
      this.customInput.customeKategoriMenu = []

      console.log(customeKategoriMenu[index])
      this.customInput.customeKategoriMenu = customeKategoriMenu[index]

      customMenu.forEach((menuItem) => {
        if (menuItem.mark_id_kategori === customeKategoriMenu[index].new_kategori_id) {
          this.customInput.customMenu.push({
            ...menuItem
          })
        }
      })
      // Log untuk memeriksa nilai customKategoriInput
      console.log(this.customInput.customeKategoriMenu)
      console.log(this.customInput.customMenu)
      this.setTypeSaveCustom('update')
    },
    setTypeSaveCustom(tipe) {
      this.typeSaveCustome = tipe
      this.dialogCustome = true
    },
    saveCustom() {
      const { customeKategoriMenu, customMenu } = this.customInput
      let forMark, kategori_id, detail_id

      if (this.typeSaveCustome === 'update') {
        forMark = customeKategoriMenu.new_kategori_id
        // Hapus kategori dan menu berdasarkan new_kategori_id
        this.FormData.customeKategoriMenu = this.FormData.customeKategoriMenu.filter(
          (item) => item.new_kategori_id !== customeKategoriMenu.new_kategori_id
        )
        this.FormData.customMenu = this.FormData.customMenu.filter(
          (item) => item.mark_id_kategori !== customeKategoriMenu.new_kategori_id
        )
        if (this.tipe == 'update') {
          kategori_id = customeKategoriMenu.kategori_detail_id
        } else {
          kategori_id = null
        }
      } else if (this.typeSaveCustome === 'create') {
        if (this.tipe == 'update') {
          if (this.FormData.customeKategoriMenu.length > 0) {
            let forMarkUpdate = Math.max(
              ...this.FormData.customeKategoriMenu.map((kategori) => kategori.new_kategori_id)
            )
            forMark = forMarkUpdate + 1
          } else {
            forMark = this.FormData.customeKategoriMenu.length
          }
          kategori_id = forMark
        } else {
          forMark = this.FormData.customeKategoriMenu.length
          kategori_id = null
        }
        detail_id = null
      }

      // Tambahkan kategori baru
      this.FormData.customeKategoriMenu.push({
        ...customeKategoriMenu,
        kategori_detail_id: kategori_id,
        new_kategori_id: forMark
      })

      // Tambahkan setiap item pada customMenu
      customMenu.forEach((menuItem) => {
        if (menuItem.nama_pilihan) {
          // Format harga jika ada
          if (this.typeSaveCustome === 'update') {
            if (this.tipe == 'update') {
              detail_id = menuItem.id_pilihan
            } else {
              detail_id = null
            }
          }
          const formatedHarga = menuItem.harga_pilihan
            ? menuItem.harga_pilihan.replace(/\./g, '')
            : ''

          this.FormData.customMenu.push({
            ...menuItem,
            id_pilihan: detail_id,
            harga_pilihan: formatedHarga,
            mark_id_kategori: forMark,
          })
        }
      })
      console.log(this.FormData)
      // Reset setelah selesai
      this.setEmpty()
    },

    async getKategori() {
      const response = await api.get('/menu/create')
      if (response.data.success) {
        console.log(response.data)
        response.data.kategori.forEach((kategori) => {
          this.kategoris.push({
            text: kategori.nama,
            value: kategori.id
          })
        })
      }
      console.log(this.kategoris)
      this.isLoading = false
    },
    async submitMenu() {
      this.btnLoading = true

      const formData = this.FormData

      const nama_kategori = formData.customeKategoriMenu.map((item) => item.nama_kategori)
      const opsi = formData.customeKategoriMenu.map((item) => item.opsi)
      const max_pilih = formData.customeKategoriMenu.map((item) => item.max_pilih)
      const nama_pilihan = formData.customMenu.map((item) => item.nama_pilihan)
      const stok_pilihan = formData.customMenu.map((item) => item.stok_pilihan)
      const harga_pilihan = formData.customMenu.map((item) => item.harga_pilihan)
      const status_pilihan = formData.customMenu.map((item) => item.status_pilihan)
      const mark_id_kategori = formData.customMenu.map((item) => item.mark_id_kategori)

      // Convert harga to string and remove non-numeric characters
      const harga =
        typeof formData.harga === 'number'
          ? formData.harga.toString()
          : formData.harga.replace(/\D/g, '')

      let data = {
        nama: formData.nama,
        kategori: formData.kategoriMenu,
        deskripsi: formData.deskripsi,
        harga,
        status: formData.status,
        gambar: formData.gambar,
        nama_kategori,
        opsi,
        max_pilih,
        nama_pilihan,
        stok_pilihan,
        harga_pilihan,
        status_pilihan,
        mark_id_kategori
      }

      // Update specific fields based on `tipe`
      if (this.tipe === 'update') {
        data.menu_id = this.data.id
        data.kategori_detail_id = formData.customeKategoriMenu.map(
          (item) => item.kategori_detail_id
        )
        data.id_detail = formData.customMenu.map((item) => item.id_pilihan)
      } else {
        data.new_kategori_id = formData.customeKategoriMenu
          .map((item) => item.new_kategori_id)
      }

      console.log(data)

      try {
        const endpoint = this.tipe === 'update' ? '/menu/updateform' : '/menu/createform'
        const message = this.tipe === 'update' ? 'Menu berhasil diupdate' : 'Menu berhasil disimpan'

        const response = await api.post(endpoint, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log(response.data)
        this.btnLoading = false
        if (response.data.success) {
            window.location.reload();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Terjadi kesalahan',
            text: 'Periksa kembali dan coba lagi!'
          })
        }
      } catch (error) {
        this.btnLoading = false
        Swal.fire({
          icon: 'error',
          title: 'Terjadi kesalahan',
          text: error.message || 'Ada masalah pada server'
        })
      }
    }
  },
  mounted() {
    this.getKategori()
    if (this.tipe === 'update') {
      this.FormData.nama = this.data.nama
      this.FormData.kategoriMenu = this.data.kategori_id
      this.FormData.deskripsi = this.data.deskripsi
      this.FormData.harga = this.data.harga
      this.FormData.status = this.data.status
      this.imageUrl = this.data.img_url

      this.data.custom_options.forEach((kategori) => {
        this.FormData.customeKategoriMenu.push({
          kategori_detail_id: kategori.id,
          nama_kategori: kategori.nama,
          opsi: kategori.opsi,
          max_pilih: kategori.max_pilih,
          new_kategori_id: kategori.id
        })
        kategori.menu_detail.forEach((pilihan) => {
          this.FormData.customMenu.push({
            id_pilihan: pilihan.id,
            nama_pilihan: pilihan.nama_pilihan,
            stok_pilihan: pilihan.stok,
            harga_pilihan: pilihan.harga,
            status_pilihan: pilihan.status,
            mark_id_kategori: kategori.id
          })
        })
      })
    }
    console.log(this.FormData)
    console.log(this.data)
  }
}
</script>

<template>
  <v-row v-if="!isLoading" no-gutters>
    <v-col cols="12" class="text-center mb-3">
      <h4>Preview</h4>
      <v-img :src="imageUrl" style="border: 1px dashed #ccc; max-height: 150px" />
    </v-col>
    <v-col cols="12">
      <v-file-input
        v-model="FormData.gambar"
        :rules="[rules.image, rules.required]"
        accept="image/png, image/jpeg, image/bmp"
        label="Gambar Menu"
        placeholder="Pilih gambar menu"
        prepend-icon="mdi-camera"
        density="compact"
        variant="outlined"
        @change="onFileChange"
        rounded
        show-size
      ></v-file-input>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="FormData.nama"
        :rules="[rules.required]"
        density="compact"
        label="Menu"
        variant="outlined"
        placeholder="contoh: rujak"
        rounded
        clearable
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <div class="select-group">
        <select v-model="FormData.kategoriMenu" class="select-custom rounded-5 mb-4">
          <option disabled value="">Please select one</option>
          <option v-for="kategori in kategoris" :key="kategori.value" :value="kategori.value">
            {{ kategori.text }}
          </option>
        </select>
        <label class="user-label">Kategori</label>
      </div>
    </v-col>
    <v-col cols="12">
      <v-textarea
        v-model="FormData.deskripsi"
        density="compact"
        label="Deskripsi"
        variant="outlined"
        placeholder="contoh: rujak"
        rounded
        auto-grow
        filled
        clearable
        rows="1"
        max-rows="5"
      ></v-textarea>
    </v-col>
    <v-col cols="6" class="px-1">
      <v-text-field
        v-model="formattedHargaNonArray"
        @blur="formatOnBlurNonArray"
        density="compact"
        label="Harga"
        variant="outlined"
        placeholder="contoh: rujak"
        rounded
        clearable
        prefix="Rp"
      ></v-text-field>
    </v-col>
    <v-col cols="6" class="px-1">
      <div class="select-group">
        <select v-model="FormData.status" class="select-custom rounded-5 mb-4">
          <option disabled value="">Please select one</option>
          <option v-for="status in itemsStatus" :key="status.value" :value="status.value">
            {{ status.text }}
          </option>
        </select>
        <label class="user-label">Status</label>
      </div>
    </v-col>
    <v-col cols="12">
      <v-btn
        class="text-none"
        prepend-icon="mdi-plus"
        block
        color="blue"
        rounded
        @click="setTypeSaveCustom('create')"
      >
        Tambahkan Custome
      </v-btn>
    </v-col>
    <v-col v-for="(kategori, index) in FormData.customeKategoriMenu" :key="index" cols="12">
      <v-card v-if="kategori.nama_kategori != ''" class="mx-auto my-3 p-3">
        <div class="d-flex justify-space-between">
          <div>
            <p class="text-h6 text-capitalize font-weight-bold mb-0">
              - {{ kategori.nama_kategori }}
            </p>
            <p>{{ kategori.opsi == 0 ? 'Opsional' : 'Wajib' }} | max {{ kategori.max_pilih }}</p>
          </div>
          <div>
            <v-btn
              size="small"
              icon="mdi-trash-can"
              color="red"
              class="mr-4"
              @click="removePickCustom(index)"
            >
            </v-btn>
            <v-btn size="small" icon="mdi-pencil" color="blue" @click="updateCustom(index)">
            </v-btn>
          </div>
        </div>
        <div v-for="(pilihan, index) in FormData.customMenu" :key="index">
          <v-card-item
            v-if="
              pilihan.nama_pilihan != '' && pilihan.mark_id_kategori == kategori.new_kategori_id
            "
            class="elevation-2 mb-2"
          >
            <v-row>
              <v-col cols="6">
                {{ pilihan.nama_pilihan }}
              </v-col>
              <v-col cols="6" class="text-end">
                Rp {{ formatRupiah(pilihan.harga_pilihan) }}
              </v-col>
              <v-col cols="7">
                <v-chip>
                  {{ pilihan.status_pilihan == 0 ? 'kosong' : 'tersedia' }}
                </v-chip>
                <v-chip>
                  {{ pilihan.stok_pilihan }}
                </v-chip>
              </v-col>
              <v-col cols="5" class="text-end">
                <v-btn
                  size="small"
                  icon="mdi-trash-can"
                  color="red"
                  class="mr-4"
                  @click="removePickCustomPilihan(index)"
                >
                </v-btn>
              </v-col>
            </v-row>
          </v-card-item>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12"> </v-col>
  </v-row>
  <!-- dialog menambah custom -->
  <v-dialog v-model="dialogCustome" transition="dialog-bottom-transition" fullscreen>
    <v-card>
      <v-toolbar class="position-sticky top-0">
        <v-btn icon="mdi-close" @click="setEmpty"></v-btn>

        <v-toolbar-title>Menambahkan Custom menu</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="customInput.customeKategoriMenu.nama_kategori"
              density="compact"
              label="Kategori Custom"
              variant="outlined"
              placeholder="contoh: Level"
              rounded
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <div class="select-group">
              <select
                v-model="customInput.customeKategoriMenu.opsi"
                class="select-custom rounded-5 mb-4"
              >
                <option disabled value="">Please select one</option>
                <option v-for="opsi in itemsOpsi" :key="opsi.value" :value="opsi.value">
                  {{ opsi.text }}
                </option>
              </select>
              <label class="user-label">Status</label>
            </div>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="customInput.customeKategoriMenu.max_pilih"
              type="number"
              density="compact"
              label="Maksimal memilih"
              variant="outlined"
              placeholder="pelanggan dapat memilih berapa"
              rounded
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <div v-for="(item, index) in customInput.customMenu" :key="index" class="mb-5">
              <v-row class="elevation-3 p-2 rounded-3" no-gutters>
                <v-col cols="12">
                  <v-text-field
                    v-model="item.nama_pilihan"
                    density="compact"
                    label="Nama Custum"
                    variant="outlined"
                    placeholder="contoh: 1"
                    rounded
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="item.stok_pilihan"
                    density="compact"
                    label="stok"
                    type="number"
                    variant="outlined"
                    placeholder="contoh: 1"
                    rounded
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="formattedAmountHargaPilihan[index]"
                    @input="updateHargaPilihan(index, $event.target.value)"
                    @blur="formatOnBlur(index)"
                    density="compact"
                    label="Harga"
                    variant="outlined"
                    placeholder="contoh: 12000"
                    prefix="Rp"
                    rounded
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <div class="select-group">
                    <select v-model="item.status_pilihan" class="select-custom rounded-5 mb-4">
                      <option disabled value="">Please select one</option>
                      <option
                        v-for="status in itemsStatus"
                        :key="status.value"
                        :value="status.value"
                      >
                        {{ status.text }}
                      </option>
                    </select>
                    <label class="user-label">Status</label>
                  </div>
                </v-col>
                <v-col cols="12">
                  <v-btn color="red" v-if="index > 0" rounded @click="removeCustom(index)" block>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12">
            <v-btn color="blue" rounded block @click="addCustom"> add </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <div class="bg-white position-sticky bottom-0 p-3">
        <v-btn color="blue" rounded @click="saveCustom" block> Simpan </v-btn>
      </div>
    </v-card>
  </v-dialog>
  <div v-if="!isLoading" class="bg-white position-sticky bottom-0 p-3 mt-3">
    <v-btn :loading="btnLoading" color="blue" rounded @click="submitMenu" block> Simpan </v-btn>
  </div>
</template>

<style scoped>
/* From Uiverse.io by alexruix */
.select-group {
  position: relative;
}

.select-custom {
  width: 100%;
  height: 40px;
  border: solid 1.5px #9e9e9e;
  border-radius: 1rem;
  background: none;
  padding: 0 1rem;
  font-size: 1rem;
  color: #000000;
  transition: border 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.user-label {
  position: absolute;
  left: 15px;
  color: #e8e8e8;
  pointer-events: none;
  transform: translateY(1rem);
  transition: 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.select-custom:focus,
select:valid {
  outline: none;
  border: 1.5px solid #000000;
}

.select-custom:focus ~ label,
select:valid ~ label {
  transform: translateY(-50%) scale(0.8);
  background-color: #ffffff;
  padding: 0 0.2em;
  color: #000000;
}
/* .swal2-container {
  z-index: 100000;
} */
</style>
