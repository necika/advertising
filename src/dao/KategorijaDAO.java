package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;
import com.fasterxml.jackson.databind.type.MapType;
import com.fasterxml.jackson.databind.type.TypeFactory;

import beans.Kategorija;

public class KategorijaDAO {

	private Map<String, Kategorija> kategorije = new HashMap<>();

	public KategorijaDAO(String path) {

		ucitajKategorije(path);
	}

	@SuppressWarnings("unchecked")
	public void ucitajKategorije(String path) {
		String putanja = path + "dummyData\\kategorije.json";
		FileWriter fileWriter = null;
		BufferedReader in = null;
		File file = null;

		try {
			file = new File(putanja);
			in = new BufferedReader(new FileReader(file));

			ObjectMapper om = new ObjectMapper();
			om.setVisibilityChecker(
					VisibilityChecker.Std.defaultInstance().withFieldVisibility(JsonAutoDetect.Visibility.ANY));
			TypeFactory tf = TypeFactory.defaultInstance();
			MapType mt = tf.constructMapType(HashMap.class, String.class, Kategorija.class);
			om.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			kategorije = (HashMap<String, Kategorija>) om.readValue(file, mt);
		} catch (FileNotFoundException e) {
			try {
				file.createNewFile();
				fileWriter = new FileWriter(file);
				ObjectMapper objectMapper = new ObjectMapper();
				objectMapper.configure(SerializationFeature.INDENT_OUTPUT, true);
				objectMapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
				String kategorija = objectMapper.writeValueAsString(kategorije);
				fileWriter.write(kategorija);
			} catch (IOException e1) {
				e1.printStackTrace();
			} finally {
				if (fileWriter != null) {
					try {
						fileWriter.close();
					} catch (Exception e2) {
						e2.printStackTrace();
					}
				}
			}
		} catch (Exception e3) {
			e3.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e4) {
					e4.printStackTrace();
				}
			}
		}
	}

	public void sacuvajKategorije(String path) {
		String putanja = path + "dummyData\\kategorije.json";
		File f = new File(putanja);
		FileWriter fw = null;

		try {
			fw = new FileWriter(f);
			ObjectMapper om = new ObjectMapper();
			om.configure(SerializationFeature.INDENT_OUTPUT, true);
			om.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
			String kategorija = om.writeValueAsString(kategorije);
			fw.write(kategorija);
			fw.flush();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fw != null) {
				try {
					fw.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
	}

	public boolean dodajKategoriju(Kategorija k) {
		if (kategorije.containsKey(k.getNaziv())) {
			return false;
		} else {
			kategorije.put(k.getNaziv(), k);

			return true;
		}
	}

	public void ukloniKategoriju(String naziv) {
		Kategorija k = kategorije.get(naziv);
		if (k != null) {
			kategorije.get(k.getNaziv()).setObrisana(true);
		}
	}

	public void izmeniKategoriju(String naziv, Kategorija k) {
		Kategorija kategorija = kategorije.get(naziv);
		k.setOglasi(kategorija.getOglasi());
		k.setObrisana(false);
		kategorije.remove(naziv);
		kategorije.put(k.getNaziv(), k);
	}

	public void dodajOglas(String naziv, String o) {
		Kategorija k = kategorije.get(naziv);
		if (k != null) {
			k.getOglasi().add(o);
		}
	}

	public void ukloniOglas(String naziv) {
		for (Kategorija kategorija : kategorije.values()) {
			kategorija.getOglasi().remove(naziv);
		}
	}

	public Kategorija getKategorija(String naziv) {
		return kategorije.get(naziv);
	}

	public Collection<Kategorija> getKategorije() {
		return kategorije.values();
	}
}
