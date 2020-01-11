Vue.component('objavi', {
    data: function() {
        return {
            naziv : undefined,
            opis : undefined, 
            cena : undefined,
            datumIsticanja : undefined,
            slika : undefined,
            grad : undefined,
            kategorija : undefined,
            pregledSlike : null,
            kategorije : null
        }
    },
    mounted : function() {
        axios.get('rest/kategorije')
            .then(response =>{this.kategorije = response.data;})
            .catch(error => {alert("Doslo je do greske prilikom ucitavanja kategorija");})    
    },    
    template : `
        <div class="content-wrap">
            <h5 class="title"><p class="text labels">Novi oglas</p></h5>
            <form accept-charset="UTF-8">
                <div class="row">
                    <div class="col-4">
                        <div class="form-group">
                            <label class="labels" for="inputNaziv">Naziv</label>
                            <input id="inputNaziv" class="form-control" type="text" placeholder="Unesite naziv oglasa" v-model="naziv">
                            <div class="invalidacija-feed"> {{nazivValidacija}} </div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputKategorija">Kategorija</label>
                            <select id="inputKategorija" v-model="kategorija" class="form-control" >
                                <option v-for="kat in kategorije" v-if="!kat.obrisana" :value="kat.naziv">{{kat.naziv}}</option>
                            </select>
                            <div class="invalidacija-fee">{{kategorijaValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputCena">Cena</label>
                            <input type="number" step="0.01" id="inputCena" class="form-control" placeholder="Unesite cenu proizvoda" v-model="cena">
                            <div class="invalidacija-feed">{{cenaValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputGrad">Grad</label>
                            <input id="inputGrad" class="form-control" type="text" placeholder="Unesite grad" v-model="grad">
                            <div class="invalidacija-feed"> {{gradValidacija}} </div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputDatumIsticanja">Datum isticanja</label>
                            <input id="inputDatumIsticanja" class="form-control" type="date" v-model="datumIsticanja">
                            <div class="invalidacija-feed"> {{datumIsticanjaValidacija}} </div>
                        </div>
                        <span>
                            <button class="btn btn-light" type="submit" v-on:click.prevent="objaviOglas">Objavi</button>
                            <button class="btn btn-light" type="submit" v-on:click.prevent="odustani">Odustani</button>
                        </span>
                    </div>
                    <div class="col-6">
                        <div class="form-group">
                            <label class="labels" for="inputOpis">Opis</label>
                            <textarea class="form-control" rows="4" id="inputOpis" placeholder="Unesite opis proizvoda" v-model="opis"></textarea>
                            <div class="invalidacija-feed">{{opisValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputSlika">Slika</label>
                            <input type="file" accept="image/*" @change=uploadImage class="form-control-file btn-light">
                            <img :src="pregledSlike" class="img-thumbnail">
                            <div class="invalidacija-feed">{{slikaValidacija}}</div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `,
    computed: {
        nazivValidacija : function() {
            if(this.naziv === '') {
                return 'Niste uneli naziv oglasa';
            } else {
                return null;
            }
        },
        kategorijaValidacija : function() {
            if(this.kategorija === '') {
                return 'Niste uneli naziv oglasa';
            } else {
                return null;
            }
        },
        cenaValidacija : function() {
            if(this.cena === null || this.cena === '') {
                return 'Cena je obavezna';
            } else if(Number(this.cena) < 0) {
                return 'Cena ne moze biti negativna';
            } else {
                return null;
            }
        },
        gradValidacija : function() {
            if(this.grad != undefined && this.grad.length > 0) {
                let gradMatch = this.grad.match('[A-Za-z ]*');
                if(gradMatch != this.grad) {
                    return 'Grad se mora sastojati samo od slova';
                } else if(this.grad[0].match('[A-Z]') === null) {
                    return 'Grad mora pocinjati velikim slovom';
                }
            } else if(this.grad === '') {
                return 'Grad je obavezno polje';
            } else {
                return null;
            }
        },
        datumIsticanjaValidacija : function() {
            if(this.datumIsticanja === '') {
                return 'Datum isticanje je obavezan';
            } else if(this.datumProvera(this.datumIsticanja)) {
                return 'Datum isticanja ne moze biti manji od trenutnog';
            } else {
                return null;
            }
        },
        opisValidacija : function() {
            if(this.opis === '') {
                return 'Opis ne sme biti prazno polje';
            } else {
                return null;
            }
        },
        slikaValidacija : function() {
            if(this.pregledSlike === '') {
                return 'Slika je obavezno polje';
            } else {
                return null;
            }
        }
    },
    methods : {
        objaviOglas : function() {
            var date = new Date();
            var mesec = ('0' + (date.getMonth() + 1)).slice(-2);
            var dan = ('0' + date.getDate()).slice(-2);
            var godina = date.getFullYear();
            var datum = godina + '-' + mesec + '-' + dan;

            var ok = true;

            let gradMatch = '';
            if(this.naziv != undefined) {
                this.naziv.trim();
            } else {
                this.naziv = '';
            }

            if(this.kategorija === undefined) {
                this.kategorija = '';
            }

            if(this.cena === undefined) {
                this.cena = null;
            }

            if(this.grad != undefined) {
                this.grad.trim();
                gradMatch = this.grad.match('[A-Za-z ]*');
            } else {
                this.grad = '';
            }

            if(this.datumIsticanja === undefined) {
                this.datumIsticanja = '';
            }

            if(this.opis === undefined) {
                this.opis = '';
            } else {
                this.opis.trim();
            }

            if(this.pregledSlike === null) {
                this.pregledSlike = '';
            }

            if(this.naziv === undefined || this.naziv === '' || this.opis === undefined || this.opis === '' ||
            this.cena === undefined || this.cena === '' || this.datumIsticanja === undefined || this.datumIsticanja === '' ||
            this.grad === undefined || this.grad === '' || this.kategorija === '' || this.kategorija === undefined || this.pregledSlike ===''){
             ok = false;
            }
            else if((gradMatch != this.grad) || (this.grad[0].match('[A-Z]') === null)){
                ok = false;
            } else if(this.datumProvera(this.datumIsticanja) || (Number(this.cena) < 0)){
                ok = false;
            }

            if(ok) {
                var oglas = {
                    'naziv' : this.naziv,
		            'cena' : this.cena,
	                'opis' : this.opis,
		            'brojLajkova' : 0,
		            'brojDislajkova' : 0,
		            'nazivSlike' : this.pregledSlike,
		            'datumPostavljanja' : datum,
		            'datumIsticanja' : this.datumIsticanja,
		            'kategorija' : this.kategorija,
		            'aktivan' : 0,
                    'grad' : this.grad,
                    'obrisan' : false
                };

                axios.post('rest/oglasi/dodaj', oglas)
                    .then(function(response) {
                        window.location.href = '#/nalog?korisnik='+app.korisnik.korisnickoIme;
                    })
                    .catch(function(error) {
                        alert(error.response.data);
                    })
            }       
        },
        
        odustani : function() {
            window.location.href = '#/nalog?korisnik='+app.korisnik.korisnickoIme;
        },

        datumProvera : function(datum) {
            var date = new Date();
            var mesec = ('0' + (date.getMonth() + 1)).slice(-2);
            var dan = ('0' + date.getDate()).slice(-2);
            var godina = date.getFullYear();
            if(datum != undefined) {
                datum = datum.split('-');
                if(datum[0] < godina) {
                    return true;
                }
                if(datum[0] > godina) {
                    return false;
                }
                if(datum[1] < mesec) {
                    return true;
                }
                if(datum[1] > mesec) {
                    return false;
                }
                if(datum[2] <= dan) {
                    return true;
                }
                return false;
            }
            return false;
        },
        uploadImage : function(e) {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {this.pregledSlike = e.target.result;};
        }
    }

});