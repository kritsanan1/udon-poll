-- Create candidates table
CREATE TABLE public.candidates (
    id SERIAL PRIMARY KEY,
    candidate_number INTEGER NOT NULL UNIQUE,
    name_th TEXT NOT NULL,
    party_th TEXT NOT NULL,
    party_en TEXT NOT NULL,
    party_color TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    facebook_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on candidates (public read access)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read candidates
CREATE POLICY "Anyone can view candidates" 
ON public.candidates 
FOR SELECT 
USING (true);

-- Create poll_settings table
CREATE TABLE public.poll_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    is_voting_open BOOLEAN NOT NULL DEFAULT true,
    election_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT '2026-02-08 00:00:00+07',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS on poll_settings (public read access)
ALTER TABLE public.poll_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read poll settings
CREATE POLICY "Anyone can view poll settings" 
ON public.poll_settings 
FOR SELECT 
USING (true);

-- Create votes table
CREATE TABLE public.votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id INTEGER NOT NULL REFERENCES public.candidates(id),
    fingerprint_hash TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on votes (public insert, read for aggregates)
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert votes (controlled by fingerprint uniqueness)
CREATE POLICY "Anyone can vote once" 
ON public.votes 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read votes (for aggregate counts)
CREATE POLICY "Anyone can view votes" 
ON public.votes 
FOR SELECT 
USING (true);

-- Create vote_logs table for admin analytics
CREATE TABLE public.vote_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID REFERENCES public.votes(id),
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vote_logs
ALTER TABLE public.vote_logs ENABLE ROW LEVEL SECURITY;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for poll_settings timestamp updates
CREATE TRIGGER update_poll_settings_updated_at
BEFORE UPDATE ON public.poll_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for votes table
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;

-- Insert initial poll settings
INSERT INTO public.poll_settings (id, is_voting_open, election_date) 
VALUES (1, true, '2026-02-08 00:00:00+07');

-- Insert all 9 candidates
INSERT INTO public.candidates (candidate_number, name_th, party_th, party_en, party_color, photo_url, facebook_url) VALUES
(1, 'ธนอนันต์ เมนะสวัสดิ์', 'พรรคกล้าธรรม', 'Kla Tham Party', '#D4AF37', 'https://i.postimg.cc/3JGBq2k3/11.jpg', 'https://www.facebook.com/thanaana.menasahwat'),
(2, 'ประชาชาติ แสนแก้ว', 'พรรคเพื่อไทย', 'Pheu Thai Party', '#E31837', 'https://i.postimg.cc/WbZny0dz/22.jpg', 'https://www.facebook.com/Prachachat555'),
(3, 'สรวิชญ์ นาแพงสอน', 'พรรคประชาชน', 'Prachachon Party', '#F97316', 'https://i.postimg.cc/pLtZMyjx/33.jpg', 'https://www.facebook.com/sorawich.Na'),
(4, 'มลิวรรณ แก้วสุข', 'พรรคประชาธิปัตย์', 'Democrat Party', '#0066CC', 'https://i.postimg.cc/bNnT51Zs/44.jpg', 'https://www.facebook.com/mli.wrrn.k.w.sukh.2024'),
(5, 'อดิศักดิ์ แก้วมุงคุณทรัพย์', 'พรรคภูมิใจไทย', 'Bhumjaithai Party', '#1E3A5F', 'https://i.postimg.cc/L6PTWjJJ/55.jpg', 'https://www.facebook.com/adisak.kaewmungkhunsap'),
(6, 'บรรพต จิกจักร์', 'พรรครวมไทยสร้างชาติ', 'Ruam Thai Sang Chart Party', '#4FC3F7', 'https://i.postimg.cc/13ZH14Fy/66.jpg', 'https://www.facebook.com/brrpht.cik.cakr'),
(7, 'สุริวรรณ คล้ายเพชร', 'พรรคเพื่อบ้านเมือง', 'Phuea Ban Muang Party', '#2E7D32', 'https://i.postimg.cc/rwLJ2z48/77.jpg', 'https://www.facebook.com/su.ri.wrrn.khlay.phechr'),
(8, 'ธนพล คำศรี', 'พรรคประชากรไทย', 'Thai Citizen Party', '#7B1FA2', 'https://i.postimg.cc/vZdzwDnY/88.jpg', 'https://www.facebook.com/thn.phl.kha.sri.925817'),
(9, 'ประกาศิต ปัญญาใส', 'พรรคเศรษฐกิจ', 'Setthakit Party', '#0D47A1', 'https://i.postimg.cc/qvdLHgK7/99.jpg', 'https://www.facebook.com/pram.prakasit.siangoon');