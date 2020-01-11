Vue.component('oglas', {
    data: function()  {
        return {
            oglas : null,
            tab : 1,
            ocena : 'Prodavac'
        }
    },
    mounted : function() {
        axios.get('rest/oglasi/' + this.$route.query.oglas)
            .then(response => {this.oglas = response.data;})
            .catch(error => {alert(error.response.data);})

        axios.get('rest/korisnici/ulogovani')
            .then(response => {app.korisnik = response.data})
            .catch(error => {alert(error.response.data);})
    },
    template : `
        <div v-if="oglas">
            <div class="content-wrap">
                <h4 class="title"><p class="text">{{oglas.naziv}}</p></h4>
                <div class="row">
                    <div class="col-6">
                        <div class="slika">
                            <img :src="oglas.nazivSlike" class="img-oglas">
                        </div>
                    </div>
                    <div class="col-3">
                        <p class="labels">Kategorija: <b>{{oglas.kategorija}}</b><br>
                        <h5 class="labels">Cena: {{oglas.cena}}€</h5></p>
                        <p><button class="btn btn-light" v-on:click="poruciProizvod(oglas)" v-if="!korisnik || (korisnik.uloga === 'Kupac' && oglas.aktivan == 0)">Poruci</button>
                        <button class="btn btn-light" v-on:click="oznaciDostavljen(oglas)" v-if="korisnik && korisnik.korisnickoIme === oglas.porucilac && oglas.aktivan === 1">Oznaci dostavljen</button>
                        <p><button class="btn btn-light" v-on:click="dodajUOmiljene(oglas)" v-if="korisnik && korisnik.uloga === 'Kupac'">Dodaj u omiljene</button></p>
                        <div  v-if="korisnik && korisnik.korisnickoIme === oglas.porucilac && oglas.aktivan === 2">
                            <p><router-link class="btn btn-light" :to="{path : '/recenzija', query : {oglas : oglas.naziv}}">Ostavi recenziju</router-link></p>
                            <form>
                                <div class="form-group">
                                    <label class="labels">Oceni</label>
                                    <select class="form-control form-control-sm" v-model="ocena">
                                        <option>Prodavac</option>
                                        <option>Oglas</option>
                                    </select>
                                </div>
                                <span>
                                    <button type="submit" class="btn btn-light" v-on:click.prevent="like">Pozitivno</button>
                                    <button type="submit" class="btn btn-light" v-on:click.prevent="dislike">Negativno</button>
                                </span>
                            </form>
                        </div>
                    </div>
                    <div class="col-3">
                        <p class="labels">Grad: <b>{{oglas.grad}}</b><br>
                        Datum postavljanja: <b>{{oglas.datumPostavljanja}}</b><br>
                        Datum isticanja: <b>{{oglas.datumIsticanja}}</b></p>
                        <p><router-link class="btn btn-light" :to="{path : '/poruka', query : {primalac : oglas.korisnickoIme}}" v-if="korisnik && korisnik.korisnickoIme != oglas.korisnickoIme">Pisi prodavcu</router-link></p>
                        <div v-if="(korisnik && korisnik.korisnickoIme === oglas.korisnickoIme) || (korisnik && korisnik.uloga === 'Administrator')">
                            <p>
                                <router-link :to="{path : '/izmeni', query : {oglas : oglas.naziv}}" class="btn btn-light">Izmeni oglas</router-link>
                                <button class="btn btn-danger" v-on:click="obrisiOglas" v-if="oglas.aktivan === 0">Obrisi oglas</button>
                            </p>
                        </div>
                    </div>
                </div>
                <ul class="list-inline">
                    <li class="list-inline-item">
                        <p class="labels">Broj pozitivnih ocena: <b>{{oglas.brojLajkova}}</b></p>
                    </li>
                    <li class="list-inline-item">
                        <p class="labels">Broj negativnih ocena: <b>{{oglas.brojDislajkova}}</b></p>
                    </li>
                </ul>
            </div>
            <div class="content-wrap">
                 <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 1}" v-on:click="tab = 1">Detaljan opis</a></li>
                    <li class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 2}" v-on:click="tab = 2">Recenzije</a></li>
                </ul>
                
                <!-- Tab panes -->
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 1}" >
                        <div style="background : white" class="jumbotron"><p style="white-space: normal;">{{oglas.opis}}</p></div>
                    </div>
                    <div role="tebpanel" class="tab-pane" v-bind:class="{active: tab === 2}">
                        <div class="row" v-for="recenzija in oglas.recenzije" v-if="!recenzija.obrisana">
                            <div class="col-8">
                                <div class="recenzija-wrap">
                                    <div class="recenzija-sadrzaj">
                                        <h5 class="title"><p class="text" style="color:black">{{recenzija.naslov}}</p></h5>
                                        <p style="white-space: normal">{{recenzija.sadrzaj}}</p>
                                        <img :src="recenzija.slika" class="img-thumbnail" v-if="recenzija.slika">
                                        <ul class="list-inline">
                                            <li class="list-inline-item">
                                                <div class="form-check-inline">
                                                    <label class="form-check-label">
                                                        Dogovor ispostovan: <input class="form-check-input" type="checkbox" :checked="recenzija.ispostovanDogovor" disabled="disabled">
                                                    </label>
                                                </div>    
                                            </li>
                                            <li class="list-inline-item">
                                                <div class="form-check-inline">
                                                    <label class="form-check-label">
                                                        Oglas tacan: <input class="form-check-input" type="checkbox" :checked="recenzija.oglasTacan" disabled="disabled">
                                                    </label>
                                                </div>    
                                            </li>
                                        </ul>
                                    </div>
                                    <span v-if="korisnik && korisnik.korisnickoIme === recenzija.recenzent">
                                        <router-link :to="{path : '/izmena/recenzije', query : {oglas : '0&' + recenzija.oglas, id : recenzija.id}}" class="btn btn-light">Izmeni</router-link>
                                        <button class="btn btn-danger" v-on:click="obrisiRecenziju(recenzija)">Obrisi</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    computed : {
        korisnik : function() {
            return app.korisnik;
        }
    },
    methods : {
        poruciProizvod : function(oglas) {
            if(!this.korisnik) {
                alert("Morate se prijaviti da bi porucivali proizvode");
            }
            axios.put('rest/oglasi/poruci/' + oglas.naziv)
                .then(response => {window.location.href = '#/nalog';})
                .catch(error => {alert(error.response.data);})
        },
        obrisiOglas : function() {
            axios.delete('rest/oglasi/obrisi/' + this.oglas.naziv) 
                .then(response => {window.location.href = '#/';})
                .catch(error => {alert(error.response.data);})
        },
        oznaciDostavljen : function(oglas) {
            axios.put('rest/oglasi/dostavljen/' + oglas.naziv) 
                .then(response => {window.location.href = '#/nalog'})
                .catch(error => {alert(error.response.data);})
        },
        obrisiRecenziju : function(recenzija) {
            axios.delete('rest/oglasi/izbrisi/recenzija', {data : recenzija})
                .then(response => {recenzija.obrisana = true;})
                .catch(error => {alert(error.response.data);})
        },
        dodajUOmiljene : function(oglas) {
            axios.put('rest/oglasi/omiljeni/' + oglas.naziv)
                .then(response => {window.location.href = "#/nalog";})
                .catch(error => {alert(error.response.data);})
        },
        like : function() {
            if(this.ocena === 'Prodavac') {
                axios.put('rest/korisnici/lajk/' + this.oglas.korisnickoIme) 
                    .then(response => {window.location.href = '#/korisnik?korisnik=' + this.oglas.korisnickoIme;})
                    .catch(error => {alert(error.response.data);})
            } else {
                var oThis = this;
                axios.put('rest/oglasi/lajk/' + this.oglas.naziv) 
                    .then(response => {oThis.oglas = response.data;})
                    .catch(error => {alert(error.response.data);})
            }
        },
        dislike : function() {
            if(this.ocena === 'Prodavac') {
                axios.put('rest/korisnici/dislajk/' + this.oglas.korisnickoIme) 
                .then(response => {window.location.href = '#/korisnik?korisnik=' + this.oglas.korisnickoIme;})
                .catch(error => {alert(error.response.data);})
            } else {
                var oThis = this;
                axios.put('rest/oglasi/dislajk/' + this.oglas.naziv) 
                    .then(response => {oThis.oglas = response.data;})
                    .catch(error => {alert(error.response.data);})
            }
        }
    }
});


Vue.component('izmeniOglas', {
    data : function() {
        return {
            oglas : null,
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
        axios.get('rest/oglasi/' + this.$route.query.oglas)
            .then(response =>{this.oglas = response.data;})
            .catch(error => {alert(error.response.data);})
        axios.get('rest/kategorije')
            .then(response =>{this.kategorije = response.data;})
            .catch(error => {alert("Doslo je do greske prilikom ucitavanja kategorija");}) 

    },
    template : `
        <div class="content-wrap">
            <h5 class="title"><p class="text labels">Izmeni oglas</p></h5>
            <form accept-charset="UTF-8">
                <div class="row">
                    <div class="col-4">
                        <div class="form-group">
                            <label class="labels" for="inputNaziv">Naziv</label>
                            <input id="inputNaziv" class="form-control" type="text" placeholder="Unesite naziv oglasa" v-model="naziv" readonly>
                            <div class="invalidacija-feed"> {{nazivValidacija}} </div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputKategorija">Kategorija</label>
                            <select id="inputKategorija" v-model="kategorija" class="form-control" >
                                <option v-for="kat in kategorije" :value="kat.naziv">{{kat.naziv}}</option>
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
                            <button class="btn btn-light" type="submit" v-on:click.prevent="izmeniOglas">Izmeni</button>
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
                            <input type="file" accept="image/*" @change=uploadImage class="form-control-file btn-dark">
                            <img :src="pregledSlike" class="img-thumbnail">
                            <div class="invalidacija-feed">{{slikaValidacija}}</div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `,
    watch : {
        oglas : function() {
            if(this.oglas != null) {
                this.naziv = this.oglas.naziv;
                this.kategorija = this.oglas.kategorija;
                this.cena = this.oglas.cena;
                this.grad = this.oglas.grad;
                this.datumIsticanja = this.oglas.datumIsticanja;
                this.opis = this.oglas.opis;
                this.pregledSlike = this.oglas.nazivSlike;
            }
        }
    },
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
            }
            else if(this.grad === '') {
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
        izmeniOglas : function() {
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
            } else if((gradMatch != this.grad) || (this.grad[0].match('[A-Z]') === null)){
                ok = false;
            } else if(this.datumProvera(this.datumIsticanja) || (Number(this.cena) < 0)){
                ok = false;
            }

            if(ok) {
                var oglas = this.oglas;

                oglas.naziv = this.naziv;
                oglas.cena = this.cena;
                oglas.opis = this.opis;
                oglas.nazivSlike = this.pregledSlike;
                oglas.datumIsticanja = this.datumIsticanja;
                oglas.kategorija = this.kategorija;
                oglas.grad = this.grad;

                axios.put('rest/oglasi/izmeni/' + oglas.naziv, oglas)
                    .then(function(response) {
                        window.location.hash = '#/oglas?oglas=' + oglas.naziv;
                    })
                    .catch(error => {alert(error.response.data);})
            }       
        },
        
        odustani : function() {
            window.location.hash = '#/oglas?oglas=' + this.$route.query.oglas;
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


Vue.component('recenzija', {
    data: function() {
        return {
            naslov: undefined,
            sadrzaj: undefined,
            na: 'Oglas',
            pregledSlike: null,
            tacan : 'true',
            dogovor : 'true',
            prijava : 'false',
            ulogovani : ''
        }
    },
    mounted: function() {
        const oThis = this;
        axios.get('rest/korisnici/ulogovani')
            .then(response => {oThis.ulogovani  = response.data;})
            .catch(error => {alert(error.response.data);})
    },
    template: `
        <div class="content-wrap">
            <h4 class="title"><p class="text labels">Recenzija</p></h4>
            <form accept-charset="UTF-8">
                <div class="row justify-content-center">
                    <div class="col-4">
                        <div class="form-group">
                            <label class="labels" for="selectNa">Recenzija na</label>
                            <select id="selectNa" class="form-control" v-model="na">
                                <option>Oglas</option>
                                <option>Prodavac</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputNaslov">Naslov</label>
                            <input class="form-control" type="text" id="inputNaslov" v-model="naslov" placeholder="Unesite naslov recenzije">
                            <div class="invalidacija-feed">{{naslovValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputSadrzaj">Sadrzaj</label>
                            <textarea id="inputSadrzaj" class="form-control" v-model="sadrzaj" rows="3" placeholder="Unesite sadrzaj recenzije"></textarea>
                            <div class="invalidacija-feed">{{sadrzajValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels">Da li je opis iz oglasa tacan</label>
                            <div class="form-control chklabels" style="border : 0">
                                <div class="form-check-inline">
                                    <label class="form-check-label labels">
                                        <input type="radio" class="form-form-check-input" name="inputTacan" value="true" v-model="tacan">
                                        Da
                                    </label>
                                </div>
                                <div class="form-check-inline">
                                    <label class="form-check-label labels">
                                        <input type="radio" class="form-form-check-input" name="inputTacan" value="false" v-model="tacan">
                                        Ne
                                    </label>   
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="labels">Da li je dogovor ispostovan</label>
                            <div class="form-control chklabels" style="border : 0">
                                <div class="form-check-inline">
                                    <label class="form-check-label labels">
                                        <input type="radio" class="form-form-check-input" name="inputDogovor" value="true" v-model="dogovor">
                                        Da
                                    </label>
                                </div>
                                <div class="form-check-inline">
                                    <label class="form-check-label labels">
                                        <input type="radio" class="form-form-check-input" name="inputDogovor" value="false" v-model="dogovor">
                                        Ne
                                    </label>   
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="labels">Da li zelite da prijavite prevaru od strane prodavca?</label>
                            <div class="form-control chklabels" style="border : 0">
                                <div class="form-check-inline">
                                    <label class="form-check-label labels">
                                        <input type="radio" class="form-form-check-input" name="inputPrijava" value="true" v-model="prijava">
                                        Da
                                    </label>
                                </div>
                                <div class="form-check-inline">
                                    <label class="form-check-label labels">
                                        <input type="radio" class="form-form-check-input" name="inputPrijava" value="false" v-model="prijava">
                                        Ne
                                    </label>   
                                </div>
                            </div>
                            <div class="invalidacija-feed">{{prijavaValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputSlika">Slika(Opciono)</label>
                            <input type="file" accept="image/*" @change=uploadImage class="form-control-file btn-light">
                            <img :src="pregledSlike" class="img-thumbnail">
                        </div>
                        <div class="form-group">
                            <span>
                                <button class="btn btn-light" type="submit" v-on:click.prevent="posaljiRecenziju">Posalji</button>
                                <button class="btn btn-light" type="submit" v-on:click.prevent="odustani">Odustani</button>
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `,

    computed : {
        naslovValidacija : function() {
            if(this.naslov === '') {
                return 'Niste uneli naslov recenzije';
            } else {
                return null;
            }
        },
        sadrzajValidacija : function() {
            if(this.sadrzaj  === '') {
                return 'Niste uneli sadrzaj recenzije';
            } else {
                return null;
            }
        },
        prijavaValidacija : function() {
            if(this.prijava === 'false') {
                return null;
            } else {
                if(this.tacan === 'true' && this.dogovor === 'true') {
                    return "Ne mozete prijaviti prodavca ako je sve bilo u redu";
                } else {
                    return null;
                }
            }
        }
    },
    methods: {
        uploadImage : function(e) {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {this.pregledSlike = e.target.result;};
        },
        posaljiRecenziju : function() {
            var ok = true;

            if(this.naslov != undefined) {
                this.naslov.trim();
            } else {
                this.naslov = '';
            }

            if(this.sadrzaj != undefined) {
                this.sadrzaj.trim();
            } else {
                this.sadrzaj = '';
            }

            if(this.naslov === undefined || this.naslov === '' || this.sadrzaj === undefined || this.sadrzaj === '') {
                ok = false;
            } else if(this.tacan === 'true' && this.dogovor === 'true' && this.prijava === 'true') {
                ok = false;
            }

            if(ok) {
                var recenzija = {
                    'oglas' : this.$route.query.oglas,
                    'recenzent' : this.ulogovani.korisnickoIme,
                    'naslov' : this.naslov,
                    'sadrzaj' : this.sadrzaj,
                    'slika' : this.pregledSlike,
                    'oglasTacan' : this.tacan,
                    'ispostovanDogovor' : this.dogovor,
                    'na' : this.na
                }

                axios.post('rest/oglasi/recenzija/' + this.prijava, recenzija)
                    .then(response => {
                        if(recenzija.na === 'Oglas') {
                            window.location.href = '#/oglas?oglas=' + response.data;
                        } else { 
                            window.location.href = '#/korisnik?korisnik=' + response.data;
                        }
                    })
                    .catch(error => {alert(error.response.data);})
            }
        },
        odustani : function() {
            window.location.href = '#/oglas?oglas=' + this.$route.query.oglas;
        }   
    }
});

Vue.component('izmenaRecenzije' , {
    data: function() {
        return{
            naslov: undefined,
            sadrzaj: undefined,
            pregledSlike: null,
            na : 'Oglas',
            tacan : 'true',
            dogovor : 'true',
            prijava : 'false',
            ulogovani : '',
            stara : null,
        }
    },
    mounted: function() {
        const oThis = this;
        axios.get('rest/korisnici/ulogovani')
            .then(response => {oThis.ulogovani  = response.data;})
            .catch(error => {alert(error.response.data);})

        axios.get('rest/oglasi/recenzija/' + this.$route.query.oglas + '/' + this.$route.query.id )
            .then(response => {oThis.stara = response.data;})
            .catch(error => {alert(error.response.data);})
    },
    template: `
        <div class="content-wrap">
            <h4 class="title"><p class="text labels">Recenzija</p></h4>
            <form accept-charset="UTF-8">
                <div class="row justify-content-center">
                    <div class="col-4">
                        <div class="form-group">
                            <label class="labels" for="inputNaslov">Naslov</label>
                            <input class="form-control" type="text" id="inputNaslov" v-model="naslov" placeholder="Unesite naslov recenzije">
                            <div class="invalidacija-feed">{{naslovValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputSadrzaj">Sadrzaj</label>
                            <textarea id="inputSadrzaj" class="form-control" v-model="sadrzaj" rows="3" placeholder="Unesite sadrzaj recenzije"></textarea>
                            <div class="invalidacija-feed">{{sadrzajValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels">Da li je opis iz oglasa tacan</label>
                            <div class="form-control chklabels" style="border : 0">
                                <div class="form-check-inline">
                                    <label class="form-check-label">
                                        <input type="radio" class="form-form-check-input" name="inputTacan" value="true" v-model="tacan">
                                        Da
                                    </label>
                                </div>
                                <div class="form-check-inline">
                                    <label class="form-check-label">
                                        <input type="radio" class="form-form-check-input" name="inputTacan" value="false" v-model="tacan">
                                        Ne
                                    </label>   
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="labels">Da li je dogovor ispostovan</label>
                            <div class="form-control chklabels" style="border : 0">
                                <div class="form-check-inline">
                                    <label class="form-check-label">
                                        <input type="radio" class="form-form-check-input" name="inputDogovor" value="true" v-model="dogovor">
                                        Da
                                    </label>
                                </div>
                                <div class="form-check-inline">
                                    <label class="form-check-label">
                                        <input type="radio" class="form-form-check-input" name="inputDogovor" value="false" v-model="dogovor">
                                        Ne
                                    </label>   
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="labels">Da li zelite da prijavite prevaru od strane prodavca?</label>
                            <div class="form-control chklabels" style="border : 0">
                                <div class="form-check-inline">
                                    <label class="form-check-label">
                                        <input type="radio" class="form-form-check-input" name="inputPrijava" value="true" v-model="prijava">
                                        Da
                                    </label>
                                </div>
                                <div class="form-check-inline">
                                    <label class="form-check-label">
                                        <input type="radio" class="form-form-check-input" name="inputPrijava" value="false" v-model="prijava">
                                        Ne
                                    </label>   
                                </div>
                            </div>
                            <div class="invalidacija-feed">{{prijavaValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels" for="inputSlika">Slika(Opciono)</label>
                            <input type="file" accept="image/*" @change=uploadImage class="form-control-file btn-light">
                            <img :src="pregledSlike" class="img-thumbnail">
                        </div>
                        <div class="form-group">
                            <span>
                                <button class="btn btn-light" type="submit" v-on:click.prevent="izmeniRecenziju">Izmeni</button>
                                <button class="btn btn-light" type="submit" v-on:click.prevent="odustani">Odustani</button>
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `,
    watch : {
        stara : function() {
            if(this.stara != null) {
                this.naslov = this.stara.naslov,
                this.sadrzaj = this.stara.sadrzaj,
                this.na = this.stara.na;
                this.pregledSlike = this.stara.slika;
                this.tacan = this.stara.oglasTacan;
                this.dogovor = this.stara.ispostovanDogovor;
            }
        }
    },
    computed : {
        naslovValidacija : function() {
            if(this.naslov === '') {
                return 'Niste uneli naslov recenzije';
            } else {
                return null;
            }
        },
        sadrzajValidacija : function() {
            if(this.sadrzaj  === '') {
                return 'Niste uneli sadrzaj recenzije';
            } else {
                return null;
            }
        },
        prijavaValidacija : function() {
            if(this.prijava === 'false') {
                return null;
            } else {
                if(this.tacan === 'true' && this.dogovor === 'true') {
                    return "Ne mozete prijaviti prodavca ako je sve bilo u redu";
                } else {
                    return null;
                }
            }
        }
    },
    methods: {
        uploadImage : function(e) {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {this.pregledSlike = e.target.result;};
        },
        izmeniRecenziju : function() {
            var ok = true;

            if(this.naslov != undefined) {
                this.naslov.trim();
            } else {
                this.naslov = '';
            }

            if(this.sadrzaj != undefined) {
                this.sadrzaj.trim();
            } else {
                this.sadrzaj = '';
            }

            if(this.naslov === undefined || this.naslov === '' || this.sadrzaj === undefined || this.sadrzaj === '') {
                ok = false;
            } else if(this.tacan === 'true' && this.dogovor === 'true' && this.prijava === 'true'){
                ok = false;
            }

            if(ok) {
                var recenzija = {
                    'oglas' : this.stara.oglas,
                    'recenzent' : this.ulogovani.korisnickoIme,
                    'naslov' : this.naslov,
                    'sadrzaj' : this.sadrzaj,
                    'slika' : this.pregledSlike,
                    'oglasTacan' : this.tacan,
                    'ispostovanDogovor' : this.dogovor,
                    'na' : this.na,
                    'id' : this.stara.id
                }

                axios.post('rest/oglasi/recenzija/izmena/' + this.$route.query.id, recenzija)
                    .then(response => {
                        if(recenzija.na === 'Oglas') { 
                            window.location.href = '#/oglas?oglas=' + response.data;
                        } else { 
                            window.location.href = '#/korisnik?korisnik=' + response.data;
                        }
                    })
                    .catch(error => {alert(error.response.data);})
            }
        },
        odustani : function() {
            window.history.back();
        }   
    }
});


Vue.component('rezultatOglas', {
	data: function() {
		return{
            oglasi : null,
		}
    },
    mounted : function(){
        var parametri = {
            'naziv' : this.$route.query.naziv,
            'cenaMin' : this.$route.query.cenaMin,
            'cenaMax' : this.$route.query.cenaMax,
            'ocenaMin' : this.$route.query.ocenaMin,
            'ocenaMax' : this.$route.query.ocenaMax,
            'datumMin' : this.$route.query.datumMin,
            'datumMax' : this.$route.query.datumMax,
            'grad' : this.$route.query.grad,
            'status' : this.$route.query.status
        }

        var pThis = this;
        axios.post('rest/oglasi/pretraga', parametri)
            .then(response => {pThis.oglasi = response.data})
            .catch(error => {alert("Neuspjesno ucitavanje rezultata pretrage");})
    },
    template: `
        <div class="content-wrap">
            <div class="row" v-if="oglasi">
                <div class="col-3" v-for="oglas in oglasi" v-if="!oglas.obrisan">
                    <div class="element-wrap">
                        <router-link :to="{path : '/oglas', query : {oglas : oglas.naziv}}">
                            <a href="#">
                                <p><img :src="oglas.nazivSlike" class="img-slika"></p>
                                <p><h5 class="text-uppercase">{{oglas.naziv}}</h5></p>
                                <p><span class="cena">{{oglas.cena}}€</span></p>
                            </a>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    computed : {
        naziv : function() { return this.$route.query.naziv},
        cenaMin : function() { return this.$route.query.cenaMin},
        cenaMax : function() { return this.$route.query.cenaMax},
        ocenaMin : function() { return this.$route.query.ocenaMin},
        ocenaMax : function() { return this.$route.query.ocenaMax},
        datumMin : function() { return this.$route.query.datumMin},
        datumMax : function() { return this.$route.query.datumMax},
        grad : function() { return this.$route.query.grad},
        status : function() { return this.$route.query.status}
    },
    watch : {
        naziv : function() { 
            this.uputiPretragu()
        },
        cenaMin : function() { 
            this.uputiPretragu()
            },
        cenaMax : function() {
            this.uputiPretragu()
            },
        ocenaMin : function() {
            this.uputiPretragu()
            },
        ocenaMax : function() {
            this.uputiPretragu()
            },
        datumMin : function() {
            this.uputiPretragu()
            },
        datumMax : function() {
            this.uputiPretragu()
            },
        grad : function() { 
            this.uputiPretragu()
            },
        status : function() {
            this.uputiPretragu()
            }
    },
    methods : {
        uputiPretragu : function() {
            var parametri = {
                'naziv' : this.naziv,
                'cenaMin' : this.cenaMin,
                'cenaMax' : this.cenaMax,
                'ocenaMin' : this.ocenaMin,
                'ocenaMax' : this.ocenaMax,
                'datumMin' : this.datumMin,
                'datumMax' : this.datumMax,
                'grad' : this.grad,
                'status' : this.status
            }

            var pThis = this;
            axios.post('rest/oglasi/pretraga', parametri)
                .then(response => {pThis.oglasi = response.data})
                .catch(error => {alert("Neuspjesno ucitavanje rezultata pretrage");})
        }
    }
})