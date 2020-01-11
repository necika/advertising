Vue.component('posaljiPoruku', {
    data: function() {
        return{
            primalac : null,
            posaljilac : null,
            naslov : undefined,
            sadrzaj : undefined,
            oglas : undefined, 
        }
    },
    mounted : function() {
        var pThis = this;
        axios.get('rest/korisnici/ulogovani')
            .then(response => {app.korisnik = response.data;
                                pThis.posaljilac = app.korisnik;})
            .catch(error => {alert(error.response.data);})

        axios.get('rest/korisnici/' + this.$route.query.primalac)
            .then(response => {pThis.primalac = response.data.korisnik;})
            .catch(error => {alert(error.response.data);})
    },
    template : `
        <div class="content-wrap" v-if="primalac">
            <form accept-charset="UTF-8">
                <div class="row justify-content-center">
                    <div class="col-6">
                        <div class="form-group">
                            <label class="labels" for="selectOglas">Oglas</label>
                            <select class="form-control" v-model="oglas" id="selectOglas">
                                <option v-for="ogl in primalac.objavljeniOglasi" v-if="primalac.uloga === 'Prodavac'">
                                    {{ogl}}
                                </option>
                                <option v-if="primalac.uloga === 'Kupac'" v-for="ogl in primalac.dostavljeniProizvodi">
                                    {{ogl.naziv}}
                                </option>
                                <option v-if="primalac.uloga === 'Kupac'" v-for="ogl in primalac.poruceniProizvodi">
                                    {{ogl}}
                                </option>
                                <option v-if="primalac.uloga === 'Administrator'" v-for="ogl in posaljilac.objavljeniOglasi">
                                    {{ogl}}
                                </option>
                            </select>
                            <div class="invalidacija-feed">{{oglasValidacija}}</div>
                        </div>
                        <div clas="form-group">
                            <label class="labels" for="inputNaslov">Naslov</label>
                            <input class="form-control" type="text" placeholder="Unesite naslov poruke" v-model="naslov" id="inputNaslov">
                            <div class="invalidacija-feed">{{naslovValidacija}}</div>
                        </div>
                        <div class="form-group">
                            <label class="labels">Sadrzaj</label>
                            <textarea id="inputSadrzaj" rows="4" placeholder="Unesite sadrzaj poruke" v-model="sadrzaj" class="form-control"></textarea>
                            <div class="invalidacija-feed">{{sadrzajValidacija}}</div>
                        </div>
                        <span>
                            <button class="btn btn-light" v-on:click.prevent="posaljiPoruku" type="submit">Posalji</button>
                            <button class="btn btn-light" v0on:click.prevent="odustani" type="submit">Odustani</button>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    `,
    computed : {
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
        posaljiPoruku : function() {
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
                var poruka = {
                    'nazivOglasa' : this.oglas,
                    'posiljalac' : this.posaljilac.korisnickoIme,
                    'naslovPoruke' : this.naslov,
                    'sadrzajPoruke' : this.sadrzaj
                }

                axios.post('rest/korisnici/posalji/' + this.primalac.korisnickoIme, poruka)
                    .then(response => {window.location.href = '#/korisnik?korisnik=' + this.$route.query.primalac;})
                    .catch(error => {alert(error.response.data);})
            }
        },
        odustani : function() {
            window.location.href = '#/korisnik?korisnik=' + this.$route.query.primalac;
        }
    }
});

