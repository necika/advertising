Vue.component('nalog', {
    data : function() {
        return {
            profil : null,
            logged : null,
            tab : 1,
            odg : null,
            sadrzaj : undefined,
            filter : null,
            prikaz : 'Aktivni'
        }
    },
    template : `
        <div v-if="profil">
            <div class="content-wrap">
                <h5 class="title"><p class="text">Korisnicki podaci</p></h5>
                <div class="container">
                    <p class="labels">Ime i prezime: <strong>{{profil.korisnik.ime}} {{profil.korisnik.prezime}}</strong></p>
                    <p class="labels">Korisnicko ime: <strong>{{profil.korisnik.korisnickoIme}}</strong></p>
                    <p class="labels">Email: <strong>{{profil.korisnik.email}}</strong></p>
                    <p class="labels">Uloga: <b>{{profil.korisnik.uloga}}</b></p>
                    <p class="labels">Telefon: <strong>{{profil.korisnik.telefon}}</strong></p>
                    <p class="labels">Grad: <strong>{{profil.korisnik.grad}}</strong></p>
                    <p class="labels">Datum registracije: <strong>{{profil.korisnik.datum}}</strong></p>
                    <div v-if="profil.korisnik.uloga === 'Prodavac'">
                        <p class="labels">Broj pozitivnih ocena: <b>{{profil.korisnik.brojLajkova}}</b></p>
                        <p class="labels">Broj negativnih ocena: <b>{{profil.korisnik.brojDislajkova}}</b></p>
                    </div>
                    <p v-show="profil.korisnik.uloga === 'Prodavac' && profil.korisnik.prijave < 3"><router-link class="btn btn-light" to="/objavi">Objavi oglas</router-link></p>
                </div>
            </div>
            <div class="content-wrap">
            <ul class="nav nav-tabs" role="tablist">
                <li v-show="profil.korisnik.uloga === 'Prodavac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 1}" v-on:click="tab = 1">Objavljeni oglasi</a></li>
                <li v-show="profil.korisnik.uloga === 'Prodavac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 2}" v-on:click="tab = 2">Recenzije</a></li>
                <li v-show="profil.korisnik.uloga === 'Kupac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 1}" v-on:click="tab = 1">Omiljeni oglasi</a></li>
                <li v-show="profil.korisnik.uloga === 'Kupac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 2}" v-on:click="tab = 2">Poruceni</a></li>
                <li v-show="profil.korisnik.uloga === 'Kupac'" class="nav-item" ><a class="nav-link tabic" v-bind:class="{active: tab === 3}" v-on:click="tab = 3">Dosatavljeni</a></li>
                <li class="nav-item"><a class="nav-link tabic" v-bind:class="{active: tab === 4}" v-on:click="tab = 4">Poruke</a></li>
            </ul>
            
            <!-- Tab panes -->
            <div class="tab-content">
                <div v-show="profil.korisnik.uloga === 'Prodavac'" role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 1}" >
                    <div class="row">
                        <div class="col-2">
                            <select class="form-control form-control-sm" v-model="prikaz">
                                <option>Aktivni</option>
                                <option>Realizacija</option>
                                <option>Dostavljeni</option>
                            </select>
                        </div>
                    </div>
                    
                    
                    <div class="row" v-if="filter">
                        <div class="col-3" v-for="oglas in filter" v-if="!oglas.obrisan">
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
                    <div class="row" v-for="recenzija in profil.korisnik.recenzije">
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
                    <div class="row" v-if="profil.poruceni">
                        <div class="col-3" v-for="oglas in profil.poruceni">
                            <div class="element-wrap">
                                <router-link :to="{path : '/oglas', query : {oglas : oglas.naziv}}">
                                    <a href="#">
                                        <p><img :src="oglas.nazivSlike" class="img-slika"></p>
                                        <p><h5 class="text-uppercase">{{oglas.naziv}}</h5></p>
                                        <p><span class="cena">{{oglas.cena}}€</span></p>
                                    </a>
                                </router-link>
                                <button class="btn btn-light btn-sm" v-on:click="oznaciDostavljen(oglas)">Oznaci dostavljeno</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="profil.korisnik.uloga === 'Kupac'" role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 3}">
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
                                <router-link :to="{path : '/recenzija' , query : {oglas : oglas.naziv}}" v-if="oglas.aktivan === 2" style="color : black" class="btn btn-light btn-sm">Ostavi recenziju</router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div role="tabpanel" class="tab-pane" v-bind:class="{active: tab === 4}">
                    <div class="row" v-for="poruka in profil.korisnik.poruke" v-if="!poruka.obrisana">
                        <div class="col-8">
                            <div class="recenzija-wrap">
                                <div class="recenzija-sadrzaj">
                                    <h5 class="title"><p class="text" style="color:black">{{poruka.naslovPoruke}}</p></h5>
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
                                            <button class="btn btn-dark btn-sm" v-if="poruka.odgovor" v-on:click="odg = poruka.id">Odgovori</button>
                                        </li>
                                    </ul>
                                    <div v-if="odg === poruka.id">
                                        <form accept-charset="UTF-8">
                                            <div class="form-group"> 
                                                <label for="iniputSadrzaj">Sadrzaj</label>
                                                <textarea id="inputSadrzaj" placeholder="Unesite sadrzaj poruke" class="form-control" rows="3" v-model="sadrzaj"></textarea>
                                                <div class="invalidacija-feed">{{validacijaSadrzaj}}</div>
                                            </div>
                                            <button class="btn btn-dark btn-sm" v-on:click.prevent="posalji(poruka)">Posalji</button>
                                            <button class="btn btn-dark btn-sm" v-on:click.prevent="odg = null">Odustani</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
        </div>
    `,
    mounted : function() {
        axios.get('rest/korisnici/ulogovani')
            .then(response => {app.korisnik = response.data; 
                                this.logged = app.korisnik;})
            .catch(error => {alert(error.response.data);})

        if(app.korisnik != null && app.korisnik.uloga === 'Prodavac') {
        axios.post('rest/oglasi/filter/Aktivni')
            .then(response => {this.filter = response.data})
            .catch(error => {alert("Neuspjesno filtriranje");})

        }
    },
    watch : {
        logged : function() {
            if(this.logged != null) {
                axios.get('rest/korisnici/' + this.logged.korisnickoIme) 
                    .then(response => {this.profil = response.data;})
                    .catch(error => {alert(error.response.data);})
            }
        },
        prikaz : function() {
            axios.post('rest/oglasi/filter/' + this.prikaz)
                .then(response => {this.filter = response.data})
                .catch(error => {alert("Neuspesno filtriranje");})
        }
    },
    computed : {
        validacijaSadrzaj : function() {
            if(this.sadrzaj === '') {
                return "Morate uneti sadrzaj poruke"
            } else {
                return null;
            }
        }
    },
    methods: {
        oznaciDostavljen : function(oglas) {
            axios.put('rest/oglasi/dostavljen/' + oglas.naziv) 
                .then(response => {window.location.href = '#/oglas?oglas=' + oglas.naziv;})
                .catch(error => {alert(error.response.data);})
        },
        posalji : function(por) {
            var ok = true;

            if(this.sadrzaj != undefined) {
                this.sadrzaj.trim();
            } else {
                this.sadrzaj = '';
            }

            if(this.sadrzaj === null || this.sadrzaj === ''){
                ok = false;
            }

            if(ok) {
                var poruka = {
                    'nazivOglasa' : por.nazivOglasa,
                    'posiljalac' : this.profil.korisnik.korisnickoIme,
                    'naslovPoruke' : por.naslovPoruke,
                    'sadrzajPoruke' : this.sadrzaj
                }

                axios.post('rest/korisnici/posalji/' + por.posiljalac, poruka)
                    .then(response => {window.location.href = '#/korisnik?korisnik=' + por.posiljalac;})
                    .catch(error => {alert(error.response.data);})
            }
        }
    }
});