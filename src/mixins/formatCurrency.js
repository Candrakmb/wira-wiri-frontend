const formatCurrency = {
    methods: {
        formatCurrency(amount) {
                // Ubah angka menjadi format mata uang Rupiah
                const formatter = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
            });
                return formatter.format(amount);
        },
    },
}

export default formatCurrency
