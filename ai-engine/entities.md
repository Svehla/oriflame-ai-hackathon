## filters

### Tags 

E.g.:
```json
{
    "GroupName": "Benefits",
    "Tags": [{
      "Value": "curling"
    }]
},
{
    "GroupName": "ColourFamilies",
    "Tags": [{
      "Value": "black"
    }]
},
{
    "GroupName": "Whos",
    "Tags": [{
      "Value": "women"
    }]
}
```

### ColorHexCode -> color 

String, e.g. "Black"

### Tags 

E.g.:
{
    "GroupName": "Benefits",
    "Tags": [{
      "Value": "curling"
    }]
},
{
    "GroupName": "ColourFamilies",
    "Tags": [{
      "Value": "black"
    }]
},
{
    "GroupName": "Whos",
    "Tags": [{
      "Value": "women"
    }]
}

	
### prod_status_descr 
 | Unknown -> 11455
 | Ongoing (N) -> 9625
 | Discontinued (D) -> 7173
 | Cancelled (Blocked) Product Brief (B) -> 4680
 | Refeature Limited Life (Z) -> 801
 | Limited Life (L) -> 35366
 | Corporate  Merchandise Material (C) -> 874
 | Refeature Ongoing (= PopUp) (X) -> 18

### npd_launch
  date
### long_descr
  string
### category_descr
| Unknown
| Accessories
| Wellness
| Skin Care
| Personal Care
| Other Category
| Colour Cosmetics
| Fragrances
| Hair Care

### development_descr
 | Unknown -> 10435
 | OCSA Purchase (Regional products) -> 1281
 | NA -> 1028
 | Global Development -> 22028
 | China Products -> 67
 | Local Purchase -> 34286
 | India Products -> 867

### sector_descr
| Nail Products -> (1327)
| Fashion Accessories -> (3351)
| Unknown -> (10435)
| Lip Products -> (4148)
| Men Fragrance -> (520)
| Bath & Shower -> (1281)
| Weight Management -> (109)
| Oral Care -> (88)
| Sun Care -> (117)
| Deodorant -> (441)
| Beauty Tools -> (1292)
| Gifts -> (286)
| Shampoos -> (352)
| Conditioners -> (303)
| Depilatories -> (31)
| Recruitment Driver / Activity Driver -> (771)
| Facial Make-Up -> (1386)
| 2in1 -> (69)
| Facial Care -> (2828)
| GDC kit -> (1460)
| Recruitment Driver / Activity Driver - Cosmetics -> (5)
| Home -> (746)
| Kids Accessories -> (684)
| Men Accessories -> (463)
| Home Fragrance -> (70)
| Cosmetic Accessories -> (184)
| Women Fragrance -> (1132)
| Corporate Merchandise -> (28041)
| Other Sector -> (1511)
| Men Shaving -> (194)
| Wellness Accessories -> (104)
| Styling -> (91)
| Charity Accessories -> (40)
| Colourants -> (24)
| Body Care -> (523)
| Foot Care -> (190)
| Deco & Gifts -> (60)
| Vitamins and Dietary Supplement -> (199)
| Hand Care -> (229)
| Sales Support Items -> (573)
| Baby Care -> (232)
| Jewellery -> (2433)
| Eye Make-Up -> (1669)

### segment_descr (cca 150)

### brand_descr (290)
```sql
select brand_descr, count(*)
from PRODUCTS

GROUP BY brand_descr
``` 

### subbrand_descr (658)

### type_descr (652)

### set_sample_cd
 | UNKNOWN	10435
 | REGP	21952
 | LSSET	191
 | FBP	3
 | ASET	401
 | NA	1103
 | LSET	3342
 | REG	29763
 | GSET	186
 | SAM	2457
 | NASET	159

### team_category_descr
 | Unknown -> 10435
 | Men Fragrance -> 787
 | Accessories -> 10685
 | Wellness -> 299
 | Skin Care -> 3108
 | Woman Fragrance -> 1514
 | Other Category -> 31367
 | Colour Cosmetics -> 8561
 | Personal & Hair Care -> 3236

