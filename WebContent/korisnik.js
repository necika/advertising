Vue.component('korisnik', {
    data : function() {
        return {
            profil : null,
            tab : 1,
            selected : 'Kupac',
            izmena : -1,
            naslov : undefined,
            sadrzaj : undefined,
            oglas : undefined, 
        }
    },
    template: `
    <div v-if="profil">
        <div class="content-wrap">
            <p><h5 class="labels">Korisnicki podaci</h5></p>
            <div class="container">
                <p class="labels">Ime i prezime: <strong>{{profil.korisnik.ime}} {{profil.korisnik.prezime}}</strong></p>
                <p class="labels">Korisnicko ime: <strong>{{profil.korisnik.korisnickoIme}}</strong></p>
                <p class="labels">Email: <strong>{{profil.korisnik.email}}</strong></p>
                <div v-if="ulogovan === 'Administrator'">
                    <p><form v-on:submit.prevent="promeniUlogu">
                        <table>
                            <tr>
                                <td class="labels">Uloga: </td>
                                <td class="labels"><b> {{profil.korisnik.uloga}} </b></td>
                                <td>
                                    <select class="form-control form-control-sm" v-model="selected">
                                        <option >Kupac</option>
                                        <option >Prodavac</option>
                                        <option >Administrator</option>
                                    </select>
                                </td>
                                <td>
                                    <button type="submit" class="btn btn-light btn-sm">Promeni</button>
                                </td>
                            </tr>
                        </table>
                    </form></p>
                </div>
                <div v-else>
                    <p class="labels">Uloga: <b>{{profil.korisnik.uloga}}</b></p>
                </div>
                <p class="labels">Telefon: <strong>{{profil.korisnik.telefon}}</strong></p>
                <p class="labels">Grad: <strong>{{profil.korisnik.grad}}</strong></p>
                <p class="labels">Datum registracije: <strong>{{profil.korisnik.datum}}</strong></p>
                <p class="labels">Broj pozitivnih ocena: <b>{{profil.korisnik.brojLajkova}}</b></p>
                <p class="labels">Broj negativnih ocena: <b>{{profil.korisnik.brojDislajkova}}</b></p>
                <p><router-link class="btn btn-light" :to="{ path : '/poruka', query : {primalac : profil.korisnik.korisnickoIme}}" v-if="kor && ((profil.korisnik.uloga === 'Administrator' &&  ulogovan === 'Prodavac') || (profil.korisnik.uloga === 'Prodavac' && ulogovan != 'Prodavac') || (profil.korisnik.uloga === 'Kupac' && ulogovan === 'Administrator'))">Pisi poruku</router-link></p>
                <div v-if="profil.korisnik.uloga === 'Prodavac' && profil.korisnik.prijave >= 3 && ulogovan === 'Administrator'">
                    <button class="btn btn-light" v-on:click="resetPrijava">Resetuj prijave</button>
                </div>
            </div>
        </div>
        <div class="content-wrap">
            <ul class="nav nav-tabs" role="tablist">
                <li v-show="profil.korisnik.uloga === 'Prodavac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 1}" v-on:click="tab = 1">Objavljeni oglasi</a></li>
                <li v-show="profil.korisnik.uloga === 'Prodavac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 2}" v-on:click="tab = 2">Recenzije</a></li>
                <li v-show="profil.korisnik.uloga === 'Kupac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 1}" v-on:click="tab = 1">Omiljeni oglasi</a></li>
                <li v-show="profil.korisnik.uloga === 'Kupac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 2}" v-on:click="tab = 2">Dosatavljeni</a></li>
                <li class="nav-item"><a class="nav-link tabic" v-bind:class="{active: tab === 3}" v-on:click="tab = 3">Poruke</a></li>
            </ul>
            
            <!-- Tab panes -->
            <div class="tab-content">
                <div v-show="profil.korisnik.uloga === 'Prodavac'" role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 1}" >
                    <div class="row" v-if="profil.objavljeni">
                        <div class="col-3" v-for="oglas in profil.objavljeni" v-if="!oglas.obrisan && (oglas.aktivan === 0 || ulogovan === 'Administrator')">
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
                <div v-show="profil.korisnik.uloga === 'Prodavac'" role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 2}">
                    <div class="row" v-for="recenzija in profil.korisnik.recenzije" v-if="!recenzija.obrisana">
                        <div class="col-8">
                            <div class="recenzija-wrap">
                                <div class="recenzija-sadrzaj">
                                    <h5 class="title"><p class="text">{{recenzija.naslov}}</p></h5>
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
                                <span v-if="kor === recenzija.recezent">
                                    <router-link :to="{path : '/izmena/recenzije', query : {oglas : '1&' + recenzija.oglas, id : recenzija.id}}" class="btn btn-dark">Izmeni</router-link>
                                    <button class="btn btn-danger" v-on:click="obrisiRecenziju(recenzija)">Obrisi</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="profil.korisnik.uloga === 'Kupac'" role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 1}">
                    <div class="row" v-if="profil.omiljeni">
                        <div class="col-3" v-for="oglas in profil.omiljeni">
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
                <div v-show="profil.korisnik.uloga === 'Kupac'" role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 2}">
                    <div class="row" v-if="profil.dostavljeni">
                        <div class="col-3" v-for="oglas in profil.dostavljeni">
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
                <div role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 3}"> 
                    <div class="row" v-for="poruka in profil.korisnik.poruke" v-if="poruka.posiljalac === kor && !poruka.obrisana">
                        <div class="col-8" v-if="izmena === poruka.id">
                            <div class="recenzija-wrap">
                                <form accept-charset="UTF-8">
                                    <div class="form-group">
                                        <label for="selectOglas">Oglas</label>
                                        <select class="form-control" v-model="oglas" id="selectOglas">
                                            <option v-if="profil.korisnik.uloga === 'Prodavac'" v-for="ogl in profil.korisnik.objavljeniOglasi">
                                                {{ogl}}
                                            </option>
                                            <option v-if="profil.korisnik.uloga === 'Kupac'" v-for="ogl in profil.korisnik.dostavljeniProizvodi">
                                                {{ogl.naziv}}
                                            </option>
                                            <option v-if="profil.korisnik.uloga === 'Kupac'" v-for="ogl in profil.korisnik.poruceniProizvodi">
                                                {{ogl}}
                                            </option>
                                            <option v-if="profil.korisnik.uloga === 'Administrator'" v-for="ogl in objavljeni">
                                                {{ogl}}
                                            </option>
                                        </select>
                                        <div class="invalidacija-feed">{{oglasValidacija}}</div>
                                    </div>
                                    <div clas="form-group">
                                        <label for="inputNaslov">Naslov</label>
                                        <input class="form-control" type="text" placeholder="Unesite naslov poruke" v-model="naslov" id="inputNaslov">
                                        <div class="invalidacija-feed">{{naslovValidacija}}</div>
                                    </div>
                                    <div class="form-group">
                                        <label>Sadrzaj</label>
                                        <textarea id="inputSadrzaj" rows="4" placeholder="Unesite sadrzaj poruke" v-model="sadrzaj" class="form-control"></textarea>
                                        <div class="invalidacija-feed">{{sadrzajValidacija}}</div>
                                    </div>
                                    <span>
                                        <button class="btn btn-dark" v-on:click.prevent="izmeniPoruku(poruka)" type="submit">Posalji</button>
                                        <button class="btn btn-dark" v0on:click.prevent="odustaniIzmena" type="submit">Odustani</button>
                                    </span>
                                </form>
                            </div>
                        </div>

                        <div class="col-8" v-else>
                            <div class="recenzija-wrap">
                                <div class="recenzija-sadrzaj">
                                    <h5 class="title"><p class="text">{{poruka.naslovPoruke}}</p></h5>
                                    <p style="white-space: normal">{{poruka.sadrzajPoruke}}</p>
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            Oglas: <b>{{poruka.nazivOglasa}}</b>    
                                        </li>
                                        <li class="list-inline-item">
                                            Od: <b>{{poruka.posiljalac}}</b>    
                                        </li>
                                        <li class="list-inline-item">
                                            Datum: <b>{{poruka.datumIVreme}}</b>    
                                        </li>
                                        <li class="list-inline-item">
                                            <span>
                                                <button class="btn btn-dark btn-sm" v-on:click="prikaziIzmena(poruka)">Izmeni</button>
                                                <button class="btn btn-danger btn-sm" v-on:click="obrisiPoruku(poruka)">Obrisi</button>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    </div>
    `,
    computed: {
        ulogovan : function() {
            if(app.korisnik != null) {
                return app.korisnik.uloga;
            }

            return '';
        },
        kor : function() {
            if(app.korisnik != null) {
                return  app.korisnik.korisnickoIme;
            }

            return null;
        },
        objavljeni : function() {
            if(app.korisnik != null) {
                return app.korisnik.objavljeniOglasi;
            }

            return '';
        },
        naslovValidacija : function() {
            if(this.naslov == '') {
                return "Naslov je obavezno polje";
            } else {
                return null;
            }
        },
        oglasValidacija : function() {
            if(this.oglas === '') {
                return "Oglas je obavezno polje";
            } else {
                return null;
            }
        },
        sadrzajValidacija : function() {
            if(this.sadrzaj === '') {
                return "Sadrzaj je obavezno polje";
            } else {
                return null;
            }
        }
    },
    methods: {
        promeniUlogu : function() {
             korisnikApp = this;
            let kor = {'ime' : korisnikApp.profil.korisnik.ime,
                        'prezime' : korisnikApp.profil.korisnik.prezime,
                        'korisnickoIme' : korisnikApp.profil.korisnik.korisnickoIme,
                        'lozinka' : korisnikApp.profil.korisnik.lozinka,
                        'email' : korisnikApp.profil.korisnik.email,
                        'uloga' : this.selected,
                        'telefon' : korisnikApp.profil.korisnik.telefon,
                        'grad' : korisnikApp.profil.korisnik.grad,
                        'datum' : korisnikApp.profil.korisnik.datum
                    }
            korisnikApp.profil.korisnik.uloga = this.selected;
            axios.put('rest/korisnici/izmena', kor)
                .then(function(response) {
                    korisnikApp.profil = response.data;
                })
                
        },
        resetPrijava : function() {
            var korisnikApp = this;
            axios.put('rest/korisnici/zabrana/' + this.profil.korisnik.korisnickoIme)
                .then(response => {korisnikApp.profil = response.data;})
                .catch(error => {alert(error.response.data);})
        },
        obrisiRecenziju : function(recenzija) {
            axios.delete('rest/oglasi/izbrisi/recenzija', { data : recenzija })
                .then(response => {recenzija.obrisana = true;})
                .catch(error => {alert(error.response.data);})
        },

        prikaziIzmena : function(poruka) {

            this.naslov = poruka.naslovPoruke;
            this.sadrzaj = poruka.sadrzajPoruke;
            this.oglas = poruka.nazivOglasa;
            
            this.izmena = poruka.id;
        },
        odustaniIzmena : function() {
            this.naslov = undefined;
            this.sadrzaj = undefined;
            this.oglas = undefined;
            
            this.izmena = -1;
        },
        izmeniPoruku : function(poruka) {
            var ok = true;

            if(this.naslov != undefined) {
                this.naslov.trim();
            } else {
                this.naslov = '';
            }

            if(this.oglas != undefined) {
                this.oglas.trim();
            } else {
                this.oglas = '';
            }

            if(this.sadrzaj != undefined) {
                this.oglas.trim();
            } else {
                this.sadrzaj = '';
            }
            
            if(this.naslov === null || this.naslov === '' || this.oglas === null || this.oglas === '' || this.sadrzaj === null || this.sadrzaj === '') {
                ok = false;
            }

            if(ok) {
                poruka.naslovPoruke = this.naslov;
                poruka.nazivOglasa = this.oglas;
                poruka.sadrzajPoruke = this.sadrzaj;

                axios.put('rest/korisnici/izmeni/' + this.profil.korisnik.korisnickoIme, poruka)
                    .then(response => {window.location.href = '#/korisnik?korisnik=' + response.data; this.izmena = -1;})
                    .catch(error => {alert(error.response.data);})
            }
        },
        obrisiPoruku : function(poruka) {
            axios.delete('rest/korisnici/poruka/obrisi/' + this.profil.korisnik.korisnickoIme + '/' + poruka.id)
                .then(response => {this.profil = response.data;})
                .catch(error => {alert(error.response.data);})
        }
    },
    mounted: function() {
        var korisnikApp = this;
        axios.get('rest/korisnici/' + this.$route.query.korisnik)
            .then(function(response) {
                korisnikApp.profil = response.data;
            })
            .catch(function(error){
                alert(error.response.data);
            })
    }
});


Vue.component('pretragaKorisnik', {
    data: function() {
        return {
            korisnici : null,
        }
    },
    mounted : function() {
        var params = {
            'ime' : this.$route.query.ime,
            'grad' : this.$route.query.grad
        }

        var kThis = this;
        axios.post('rest/korisnici/parametri', params ) 
            .then(response => {kThis.korisnici = response.data})
            .catch(error => {alert("Nesuspjesno ucitavanje korisnika")})
    },
    template: `
        <div class="content-wrap">
            <div class="row" v-if="korisnici">
                <div class="col-3" v-for="korisnik in korisnici">
                    <div class="element-wrap">
                        <router-link v-bind:to="{ 
                                            path: '/korisnik',
                                            query: {
                                                korisnik : korisnik.korisnickoIme
                                            }
                                        }">
                            <p>{{korisnik.uloga}}</p>
                            <p class="text-uppercase">{{korisnik.ime}} {{korisnik.prezime}}</p>
                            <p><h5>{{korisnik.korisnickoIme}}</h5></p>
                            <p>{{korisnik.email}}</p>
                            <p>{{korisnik.telefon}}</p>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    computed : {
        ime : function() {return this.$route.query.ime;},
        grad : function() {return this.$route.query.grad;}
    },
    watch: {
        ime : function() {this.pretrazi()},
        grad : function() {this.pretrazi()}
    },
    methods : {
        pretrazi : function() {
            var params = {
                'ime' : this.$route.query.ime,
                'grad' : this.$route.query.grad
            }
    
            var kThis = this;
            axios.post('rest/korisnici/parametri', params) 
                .then(response => {kThis.korisnici = response.data})
                .catch(error => {alert("Nesuspjesno ucitavanje korisnika")})
        }
    }

});